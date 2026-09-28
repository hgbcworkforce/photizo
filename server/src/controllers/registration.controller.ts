import { Request, Response } from 'express';
import { z } from 'zod';
import { attendeeService } from '../services/attendee.service';
import { paystackService } from '../services/paystack.service';
import { paymentService } from '../services/payment.service';
import { emailService } from '../services/email.service';

export const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().min(7, 'Please provide a valid phone number'),
  gender: z.string().optional(),
  ageRange: z.string().optional(),
  referralSource: z.string().optional(),
  breakoutSessionChoice: z.string().optional(),
  attendanceMode: z.string().optional(),
  expectations: z.string().optional(),
  registrationType: z.enum(['student', 'professional'], {
    errorMap: () => ({ message: 'Registration type must be either Student or Professional' }),
  }).default('student'),
  amount: z.number().positive('Registration requires a valid paid amount (₦1,000 for Student, ₦2,000 for Professional)'),
  callbackUrl: z.string().url().optional(),
});

export const registrationController = {
  /**
   * Initiates registration and creates a Paystack checkout session
   */
  async initiate(req: Request, res: Response) {
    try {
      const data = req.body;
      const paymentReference = `BISUM-TX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // 1. Create or update Pending Attendee Record
      const pendingAttendee = await attendeeService.createPendingRegistration({
        ...data,
        amountPaid: data.amount,
        paymentReference,
      });

      // 2. Initialize Paystack Checkout Transaction
      const paystackResponse = await paystackService.initializeTransaction({
        email: data.email,
        amount: data.amount,
        reference: paymentReference,
        callbackUrl: data.callbackUrl,
        metadata: {
          registration_id: pendingAttendee.id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          registration_type: data.registrationType,
          breakout_session_choice: data.breakoutSessionChoice,
          attendance_mode: data.attendanceMode || 'On-site',
        },
      });

      // 3. Record Pending Payment in payments log
      await paymentService.recordPayment({
        reference: paymentReference,
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        amount: data.amount,
        currency: 'NGN',
        status: 'pending',
        metadata: {
          registration_id: pendingAttendee.id,
          registration_type: data.registrationType,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Registration initiated. Redirecting to payment...',
        data: {
          authorizationUrl: paystackResponse.data.authorization_url,
          accessCode: paystackResponse.data.access_code,
          reference: paymentReference,
          registrationId: pendingAttendee.id,
        },
      });
    } catch (error: any) {
      console.error('Initiate Registration Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to initiate registration.',
      });
    }
  },

  /**
   * Retrieves registration status by reference
   */
  async getStatus(req: Request, res: Response) {
    try {
      const reference = String(req.params.reference);
      if (!reference || reference === 'undefined') {
        return res.status(400).json({ success: false, message: 'Reference parameter is required' });
      }

      const attendee = await attendeeService.getByReference(reference);
      if (!attendee) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      return res.status(200).json({
        success: true,
        data: attendee,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve registration status',
      });
    }
  },
};
