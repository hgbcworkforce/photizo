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

      const response = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: [data.email],
        subject: `Pass Confirmed: Welcome to ${env.CONFERENCE_NAME}! [ID: ${data.registrationNumber}]`,
        html,
      });

      if (response.error) {
        console.error('Resend Error Response:', response.error);
        return { success: false, error: response.error };
      }

      console.log(`✅ Confirmation email sent via Resend to ${data.email} (${data.registrationNumber})`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Failed to send Resend email:', error?.message || error);
      return { success: false, error: error?.message || 'Email delivery failed' };
    }
  },

  /**
   * Sends a merchandise order confirmation email using Resend
   */
  async sendMerchandiseOrderConfirmation(data: SendMerchandiseParams) {
    try {
      const html = generateMerchandiseEmailTemplate(data);

      const response = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: [data.customerEmail],
        subject: `Order Confirmed: ${env.CONFERENCE_NAME} Official Store [Order: ${data.orderNumber}]`,
        html,
      });

      if (response.error) {
        console.error('Resend Merchandise Email Error:', response.error);
        return { success: false, error: response.error };
      }

      console.log(`✅ Merchandise order email sent via Resend to ${data.customerEmail} (${data.orderNumber})`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Failed to send Resend merchandise email:', error?.message || error);
      return { success: false, error: error?.message || 'Email delivery failed' };
    }
  },
};
