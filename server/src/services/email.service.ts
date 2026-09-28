import { resend } from '../config/resend';
import { env } from '../config/env';
import { generateRegistrationEmailTemplate } from '../templates/registrationEmail';
import { generateMerchandiseEmailTemplate } from '../templates/merchandiseEmail';

interface SendConfirmationParams {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  registrationNumber: string;
  registrationType: string;
  attendanceMode?: string;
  breakoutSessionChoice?: string;
  amountPaid?: number;
}

interface SendMerchandiseParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  pickupOption?: string;
}

export const emailService = {
  /**
   * Sends a registration confirmation email using Resend
   */
  async sendRegistrationConfirmation(data: SendConfirmationParams) {
    try {
      const html = generateRegistrationEmailTemplate(data);
      const subject = `Pass Confirmed: Welcome to ${env.CONFERENCE_NAME}! [ID: ${data.registrationNumber}]`;

      // 1. Primary Attempt with configured sender
      let response = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: [data.email],
        subject,
        html,
      });

      // 2. Fallback Attempt if custom sender domain is unverified on Resend
      if (response.error && env.RESEND_FROM_EMAIL !== 'Photizo Conference <onboarding@resend.dev>') {
        console.warn(`⚠️ Resend custom domain send failed (${JSON.stringify(response.error)}). Attempting fallback via onboarding@resend.dev...`);
        response = await resend.emails.send({
          from: 'Photizo Conference <onboarding@resend.dev>',
          to: [data.email],
          subject,
          html,
        });
      }

      if (response.error) {
        console.error('❌ Resend Registration Email Error:', response.error);
        return { success: false, error: response.error };
      }

      console.log(`✅ Confirmation email successfully sent via Resend to ${data.email} (${data.registrationNumber}) [MessageId: ${response.data?.id}]`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('❌ Failed to send Resend registration email:', error?.message || error);
      return { success: false, error: error?.message || 'Email delivery failed' };
    }
  },

  /**
   * Sends a merchandise order confirmation email using Resend
   */
  async sendMerchandiseOrderConfirmation(data: SendMerchandiseParams) {
    try {
      const html = generateMerchandiseEmailTemplate(data);
      const subject = `Order Confirmed: ${env.CONFERENCE_NAME} Official Store [Order: ${data.orderNumber}]`;

      // 1. Primary Attempt with configured sender
      let response = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: [data.customerEmail],
        subject,
        html,
      });

      // 2. Fallback Attempt if custom sender domain is unverified on Resend
      if (response.error && env.RESEND_FROM_EMAIL !== 'Photizo Conference <onboarding@resend.dev>') {
        console.warn(`⚠️ Resend custom domain send failed (${JSON.stringify(response.error)}). Attempting fallback via onboarding@resend.dev...`);
        response = await resend.emails.send({
          from: 'Photizo Conference <onboarding@resend.dev>',
          to: [data.customerEmail],
          subject,
          html,
        });
      }

      if (response.error) {
        console.error('❌ Resend Merchandise Email Error:', response.error);
        return { success: false, error: response.error };
      }

      console.log(`✅ Merchandise order email successfully sent via Resend to ${data.customerEmail} (${data.orderNumber}) [MessageId: ${response.data?.id}]`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('❌ Failed to send Resend merchandise email:', error?.message || error);
      return { success: false, error: error?.message || 'Email delivery failed' };
    }
  },
};
