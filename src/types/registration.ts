export type PaymentStatus = 'pending' | 'completed' | 'paid' | 'failed';

export interface RegistrationData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  gender?: string;
  ageRange?: string;
  attendanceMode: string;
  referralSource: string;
  breakoutSessionChoice: string;
  expectations?: string;
  registrationType?: 'student' | 'professional' | string;
  amount?: number;
  amountPaid?: number;
  paymentStatus?: PaymentStatus;
  registrationNumber?: string;
  paymentReference?: string;
  createdAt?: string;
}

export interface Attendee extends RegistrationData {
  id: string;
  registrationNumber: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface PaymentResponse {
  authorizationUrl?: string;
  checkoutUrl?: string;
  accessCode?: string;
  reference: string;
  amount?: number;
  registrationId?: string;
  registration?: Attendee;
}