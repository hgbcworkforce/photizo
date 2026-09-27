export interface Attendee {
  id?: string;
  registrationNumber?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  ageRange?: string;
  referralSource?: string;
  breakoutSessionChoice?: string;
  attendanceMode?: 'On-site' | 'Online' | string;
  expectations?: string;
  registrationType: 'student' | 'professional' | string;
  amountPaid?: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentReference?: string;
  emailSent?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MerchandiseOrder {
  id?: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemId: string;
  itemName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  pickupOption?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  fulfillmentStatus?: 'unfulfilled' | 'ready' | 'picked_up';
  paymentReference?: string;
  emailSent?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  id?: string;
  reference: string;
  paystackId?: string;
  customerName?: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'abandoned';
  channel?: string;
  metadata?: Record<string, any>;
  paidAt?: string;
  createdAt?: string;
}

export interface AdminUser {
  id?: string;
  userId: string;
  email: string;
  fullName: string;
  role: 'admin' | 'superadmin' | 'viewer';
  isActive: boolean;
  createdAt?: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
    };
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}
