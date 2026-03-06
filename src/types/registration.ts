export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  attendanceMode: string;
  referralSource: string;
  breakoutSessionChoice: string;
  expectations?: string;
}

export interface Attendee extends RegistrationData {
  id: string;
  registrationNumber: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface PaymentResponse {
  checkoutUrl?: string;
  accessCode?: string; // If using Paystack Access Code flow
  reference: string;
  amount: number;
}