import { Request, Response } from 'express';
import { z } from 'zod';
import { merchandiseService } from '../services/merchandise.service';
import { paystackService } from '../services/paystack.service';
import { paymentService } from '../services/payment.service';

export const merchandiseOrderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z.string().min(7, 'Please enter a valid phone number'),
  itemId: z.string().min(1, 'Item ID is required'),
  itemName: z.string().min(1, 'Item Name is required'),
  color: z.string().min(1, 'Color selection is required'),
  size: z.string().min(1, 'Size selection is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().positive('Unit price must be greater than 0'),
  pickupOption: z.string().optional().default('On-site Conference Pickup'),
  callbackUrl: z.string().url().optional(),
});

export const merchandiseController = {
  /**
   * Initiates a merchandise purchase and creates a Paystack checkout session
   */
  async initiate(req: Request, res: Response) {
    try {
      const data = req.body;
      const totalAmount = data.unitPrice * data.quantity;
      const paymentReference = `BISUM-MERCH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // 1. Create Pending Merchandise Order
      const pendingOrder = await merchandiseService.createPendingOrder({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        itemId: data.itemId,
        itemName: data.itemName,
        color: data.color,
        size: data.size,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalAmount,
        pickupOption: data.pickupOption,
        paymentReference,
      });

      // 2. Initialize Paystack Transaction
      const paystackResponse = await paystackService.initializeTransaction({
        email: data.customerEmail,
        amount: totalAmount,
        reference: paymentReference,
        callbackUrl: data.callbackUrl,
        metadata: {
          type: 'merchandise_order',
          order_id: pendingOrder.id,
          customer_name: data.customerName,
          customer_phone: data.customerPhone,
          item_name: data.itemName,
          color: data.color,
          size: data.size,
          quantity: data.quantity,
        },
      });

      // 3. Record Pending Payment
      await paymentService.recordPayment({
        reference: paymentReference,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        amount: totalAmount,
        currency: 'NGN',
        status: 'pending',
        metadata: {
          type: 'merchandise_order',
          order_id: pendingOrder.id,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Order initiated. Redirecting to payment...',
        data: {
          authorizationUrl: paystackResponse.data.authorization_url,
          accessCode: paystackResponse.data.access_code,
          reference: paymentReference,
          orderId: pendingOrder.id,
          totalAmount,
        },
      });
    } catch (error: any) {
      console.error('Merchandise Order Init Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to initiate merchandise order.',
      });
    }
  },

  /**
   * Retrieves merchandise order status by reference
   */
  async getStatus(req: Request, res: Response) {
    try {
      const reference = String(req.params.reference);
      if (!reference || reference === 'undefined') {
        return res.status(400).json({ success: false, message: 'Reference parameter is required' });
      }

      const order = await merchandiseService.getByReference(reference);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Merchandise order not found' });
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve order status',
      });
    }
  },
};
