import { Request, Response } from 'express';
import { paystackService } from '../services/paystack.service';
import { attendeeService } from '../services/attendee.service';
import { merchandiseService } from '../services/merchandise.service';
import { paymentService } from '../services/payment.service';
import { emailService } from '../services/email.service';

export const paymentController = {
  /**
   * Verifies a Paystack payment reference, confirms registration or merchandise order, and triggers email
   */
  async verifyPayment(req: Request, res: Response) {
    try {
      const reference = String(req.params.reference);

      if (!reference || reference === 'undefined') {
        return res.status(400).json({
          success: false,
          message: 'Transaction reference is required.',
        });
      }

      const isMerchandise = reference.startsWith('BISUM-MERCH');

      // 1. Check if already confirmed in our database
      if (isMerchandise) {
        const existingOrder = await merchandiseService.getByReference(reference);
        if (existingOrder && existingOrder.payment_status === 'paid') {
          return res.status(200).json({
            success: true,
            message: 'Merchandise payment already verified and confirmed.',
            data: {
              verified: true,
              type: 'merchandise',
              order: existingOrder,
            },
          });
        }
      } else {
        const existingAttendee = await attendeeService.getByReference(reference);
        if (existingAttendee && existingAttendee.payment_status === 'paid') {
          return res.status(200).json({
            success: true,
            message: 'Registration payment already verified and confirmed.',
            data: {
              verified: true,
              type: 'registration',
              registration: existingAttendee,
            },
          });
        }
      }

      // 2. Call Paystack API to verify transaction
      const paystackData = await paystackService.verifyTransaction(reference);

      if (!paystackData.status || paystackData.data.status !== 'success') {
        await paymentService.recordPayment({
          reference,
          paystackId: String(paystackData.data.id || ''),
          customerEmail: paystackData.data.customer.email,
          amount: paystackData.data.amount / 100,
          status: 'failed',
          paidAt: paystackData.data.paid_at,
        });

        return res.status(400).json({
          success: false,
          message: paystackData.data.gateway_response || 'Payment was not successful.',
          data: {
            verified: false,
            status: paystackData.data.status,
          },
        });
      }

      const transaction = paystackData.data;
      const amountInNaira = transaction.amount / 100;
      const metadata = transaction.metadata || {};

      if (isMerchandise || metadata.type === 'merchandise_order') {
        // --- Confirm Merchandise Order ---
        let order;
        if (metadata.order_id) {
          order = await merchandiseService.confirmOrderById(metadata.order_id, amountInNaira);
        } else {
          order = await merchandiseService.confirmOrderByReference(reference, amountInNaira);
        }

        await paymentService.recordPayment({
          reference,
          paystackId: String(transaction.id),
          customerName: order?.customer_name || `${transaction.customer.first_name || ''} ${transaction.customer.last_name || ''}`.trim(),
          customerEmail: transaction.customer.email,
          amount: amountInNaira,
          currency: transaction.currency,
          status: 'success',
          channel: transaction.channel,
          metadata: transaction.metadata,
          paidAt: transaction.paid_at,
        });

        if (order && !order.email_sent) {
          await emailService.sendMerchandiseOrderConfirmation({
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

          await merchandiseService.markEmailSent(order.id);
        }

        return res.status(200).json({
          success: true,
          message: 'Merchandise payment verified and order completed successfully!',
          data: {
            verified: true,
            type: 'merchandise',
            order,
          },
        });
      } else {
        // --- Confirm Attendee Registration ---
        let attendee;
        if (metadata.registration_id) {
          attendee = await attendeeService.confirmRegistrationById(metadata.registration_id, amountInNaira);
        } else {
          attendee = await attendeeService.confirmRegistrationByReference(reference, amountInNaira);
        }

        await paymentService.recordPayment({
          reference,
          paystackId: String(transaction.id),
          customerName: `${attendee?.first_name || ''} ${attendee?.last_name || ''}`.trim(),
          customerEmail: transaction.customer.email,
          amount: amountInNaira,
          currency: transaction.currency,
          status: 'success',
          channel: transaction.channel,
          metadata: transaction.metadata,
          paidAt: transaction.paid_at,
        });

        if (attendee && !attendee.email_sent) {
          await emailService.sendRegistrationConfirmation({
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

          await attendeeService.markEmailSent(attendee.id);
        }

        return res.status(200).json({
          success: true,
          message: 'Payment verified and registration completed successfully!',
          data: {
            verified: true,
            type: 'registration',
            registration: attendee,
          },
        });
      }
    } catch (error: any) {
      console.error('Payment Verification Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Payment verification failed.',
      });
    }
  },
};
