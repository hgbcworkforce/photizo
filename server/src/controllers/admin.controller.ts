import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { attendeeService } from '../services/attendee.service';
import { merchandiseService } from '../services/merchandise.service';
import { paymentService } from '../services/payment.service';
import { emailService } from '../services/email.service';

export const adminController = {
  /**
   * Retrieves dashboard summary metrics
   */
  async getDashboardMetrics(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await attendeeService.getDashboardAnalytics();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Admin Analytics Error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Paginated list of attendees with search & filters
   */
  async getAttendees(req: AuthenticatedRequest, res: Response) {
    try {
      const { search, status, registrationType, breakoutSession, attendanceMode, page, limit } = req.query;

      const result = await attendeeService.listAttendees({
        search: search as string,
        status: status as string,
        registrationType: registrationType as string,
        breakoutSession: breakoutSession as string,
        attendanceMode: attendanceMode as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Admin Get Attendees Error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Single attendee details
   */
  async getAttendeeById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const attendee = await attendeeService.getById(id);

      if (!attendee) {
        return res.status(404).json({ success: false, message: 'Attendee not found.' });
      }

      return res.status(200).json({
        success: true,
        data: attendee,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Updates an attendee record
   */
  async updateAttendee(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const updated = await attendeeService.updateAttendee(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Attendee record updated successfully.',
        data: updated,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Deletes an attendee record
   */
  async deleteAttendee(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      await attendeeService.deleteAttendee(id);

      return res.status(200).json({
        success: true,
        message: 'Attendee record deleted successfully.',
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Manually re-sends confirmation email to attendee
   */
  async resendConfirmationEmail(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const attendee = await attendeeService.getById(id);

      if (!attendee) {
        return res.status(404).json({ success: false, message: 'Attendee not found.' });
      }

      const emailResult = await emailService.sendRegistrationConfirmation({
        firstName: attendee.first_name,
        lastName: attendee.last_name,
        email: attendee.email,
        phone: attendee.phone,
        registrationNumber: attendee.registration_number || 'N/A',
        registrationType: attendee.registration_type,
        attendanceMode: attendee.attendance_mode,
        breakoutSessionChoice: attendee.breakout_session_choice,
        amountPaid: attendee.amount_paid,
      });

      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send email via Resend.',
          error: emailResult.error,
        });
      }

      await attendeeService.markEmailSent(attendee.id);

      return res.status(200).json({
        success: true,
        message: `Confirmation email successfully sent to ${attendee.email}`,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Lists payments audit trail
   */
  async getPayments(req: AuthenticatedRequest, res: Response) {
    try {
      const { search, status, page, limit } = req.query;

      const result = await paymentService.listPayments({
        search: search as string,
        status: status as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Exports all attendees as a CSV file
   */
  async exportAttendeesCsv(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await attendeeService.listAttendees({ limit: 10000 });
      const attendees = result.attendees;

      const headers = [
        'Registration ID',
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Gender',
        'Age Range',
        'Attendance Mode',
        'Pass Type',
        'Breakout Session',
        'Amount Paid (NGN)',
        'Payment Status',
        'Registered At',
      ];

      const rows = attendees.map((a: any) => [
        `"${a.registration_number || ''}"`,
        `"${a.first_name || ''}"`,
        `"${a.last_name || ''}"`,
        `"${a.email || ''}"`,
        `"${a.phone || ''}"`,
        `"${a.gender || ''}"`,
        `"${a.age_range || ''}"`,
        `"${a.attendance_mode || 'On-site'}"`,
        `"${a.registration_type || ''}"`,
        `"${a.breakout_session_choice || ''}"`,
        `"${a.amount_paid || 0}"`,
        `"${a.payment_status || ''}"`,
        `"${a.created_at || ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=bisum_attendees_${Date.now()}.csv`);
      return res.status(200).send(csvContent);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Lists merchandise orders with filters and pagination
   */
  async getMerchandiseOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const { search, paymentStatus, fulfillmentStatus, itemId, page, limit } = req.query;

      const result = await merchandiseService.listOrders({
        search: search as string,
        paymentStatus: paymentStatus as string,
        fulfillmentStatus: fulfillmentStatus as string,
        itemId: itemId as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Updates merchandise order status (e.g. mark as fulfilled / picked_up)
   */
  async updateMerchandiseOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const updated = await merchandiseService.updateOrder(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Merchandise order updated successfully.',
        data: updated,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Deletes a merchandise order
   */
  async deleteMerchandiseOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      await merchandiseService.deleteOrder(id);

      return res.status(200).json({
        success: true,
        message: 'Merchandise order deleted successfully.',
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Re-sends merchandise order confirmation email
   */
  async resendMerchandiseEmail(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const order = await merchandiseService.getById(id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Merchandise order not found.' });
      }

      const emailResult = await emailService.sendMerchandiseOrderConfirmation({
        orderNumber: order.order_number || 'N/A',
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

      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send merchandise email via Resend.',
          error: emailResult.error,
        });
      }

      await merchandiseService.markEmailSent(order.id);

      return res.status(200).json({
        success: true,
        message: `Merchandise order confirmation email sent to ${order.customer_email}`,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Exports all merchandise orders as a CSV file
   */
  async exportMerchandiseOrdersCsv(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await merchandiseService.listOrders({ limit: 10000 });
      const orders = result.orders;

      const headers = [
        'Order Number',
        'Customer Name',
        'Email',
        'Phone',
        'Item Name',
        'Color',
        'Size',
        'Quantity',
        'Unit Price (NGN)',
        'Total Amount (NGN)',
        'Payment Status',
        'Fulfillment Status',
        'Pickup Option',
        'Ordered At',
      ];

      const rows = orders.map((o: any) => [
        `"${o.order_number || ''}"`,
        `"${o.customer_name || ''}"`,
        `"${o.customer_email || ''}"`,
        `"${o.customer_phone || ''}"`,
        `"${o.item_name || ''}"`,
        `"${o.color || ''}"`,
        `"${o.size || ''}"`,
        `"${o.quantity || 1}"`,
        `"${o.unit_price || 0}"`,
        `"${o.total_amount || 0}"`,
        `"${o.payment_status || ''}"`,
        `"${o.fulfillment_status || ''}"`,
        `"${o.pickup_option || ''}"`,
        `"${o.created_at || ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=bisum_merchandise_orders_${Date.now()}.csv`);
      return res.status(200).send(csvContent);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
