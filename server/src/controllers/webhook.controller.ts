import crypto from 'crypto';
import { Request, Response } from 'express';
import { env } from '../config/env';
import { attendeeService } from '../services/attendee.service';
import { merchandiseService } from '../services/merchandise.service';
import { paymentService } from '../services/payment.service';
import { emailService } from '../services/email.service';

export const webhookController = {
  /**
   * Handles incoming Paystack webhook events
   */
  async handlePaystackWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-paystack-signature'] as string;

      if (!signature) {
        console.warn('⚠️ Webhook received without signature header.');
        return res.status(401).json({ message: 'Missing signature header' });
      }

      // Verify HMAC-SHA512 signature using the raw buffer
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.warn('❌ Invalid Paystack webhook signature detected.');
        return res.status(401).json({ message: 'Invalid webhook signature' });
      }

      const event = req.body;
      console.log(`📩 Paystack Webhook Event Received: ${event.event}`);

      if (event.event === 'charge.success') {
        const { reference, amount, customer, channel, paid_at, metadata, id: paystackId } = event.data;
        const amountInNaira = amount / 100;

        // 1. Check if already processed (Idempotency)
        const existingPayment = await paymentService.getByReference(reference);
        if (existingPayment && existingPayment.status === 'success') {
          console.log(`ℹ️ Webhook: Transaction ${reference} already processed.`);
          return res.status(200).json({ received: true });
        }

        const isMerchandise =
          metadata?.type === 'merchandise_order' ||
          reference.startsWith('PHOTIZO-MERCH') ||
          reference.startsWith('BISUM-MERCH');

        if (isMerchandise) {
          // --- Handle Merchandise Order ---
          let order;
          if (metadata?.order_id) {
            order = await merchandiseService.confirmOrderById(metadata.order_id, amountInNaira);
          } else {
            order = await merchandiseService.confirmOrderByReference(reference, amountInNaira);
          }

          // Record Payment
          await paymentService.recordPayment({
            reference,
            paystackId: String(paystackId),
            customerName:
              order?.customer_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
            customerEmail: customer.email,
            amount: amountInNaira,
            currency: 'NGN',
            status: 'success',
            channel,
            metadata,
            paidAt: paid_at,
          });

          // Send Confirmation Email via Resend
          if (order && !order.email_sent) {
            const emailRes = await emailService.sendMerchandiseOrderConfirmation({
              orderNumber: order.order_number,
              customerName: order.customer_name,
              customerEmail: order.customer_email,
              customerPhone: order.customer_phone,
              itemName: order.item_name,
              color: order.color,
              size: order.size,
              quantity: order.quantity,
              unitPrice: order.unit_price,
              totalAmount: order.total_amount,
              pickupOption: order.pickup_option,
            });

            if (emailRes.success) {
              await merchandiseService.markEmailSent(order.id);
            }
          }

          console.log(`✅ Webhook: Processed merchandise order and sent confirmation: ${reference}`);
        } else {
          // --- Handle Conference Registration ---
          let attendee;
          if (metadata?.registration_id) {
            attendee = await attendeeService.confirmRegistrationById(metadata.registration_id, amountInNaira);
          } else {
            attendee = await attendeeService.confirmRegistrationByReference(reference, amountInNaira);
          }

          // Record Payment
          await paymentService.recordPayment({
            reference,
            paystackId: String(paystackId),
            customerName: `${attendee?.first_name || ''} ${attendee?.last_name || ''}`.trim(),
            customerEmail: customer.email,
            amount: amountInNaira,
            currency: 'NGN',
            status: 'success',
            channel,
            metadata,
            paidAt: paid_at,
          });

          // Send Confirmation Email via Resend
          if (attendee && !attendee.email_sent) {
            const emailRes = await emailService.sendRegistrationConfirmation({
              firstName: attendee.first_name,
              lastName: attendee.last_name,
              email: attendee.email,
              phone: attendee.phone,
              registrationNumber: attendee.registration_number,
              registrationType: attendee.registration_type,
              attendanceMode: attendee.attendance_mode,
              breakoutSessionChoice: attendee.breakout_session_choice,
              amountPaid: attendee.amount_paid,
            });

            if (emailRes.success) {
              await attendeeService.markEmailSent(attendee.id);
            }
          }

          console.log(`✅ Webhook: Processed registration payment and sent confirmation: ${reference}`);
        }
      }

      // Always return 200 OK to Paystack
      return res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook Processing Error:', error);
      return res.status(200).json({ received: true, error: error.message });
    }
  },
};
