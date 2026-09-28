import axios from 'axios';
import { supabase } from '../lib/supabase';
import { authUtils } from '../utils/authUtils';
import type { RegistrationData, Attendee, PaymentResponse } from '../types/registration';
import type { OrderPayload } from '../types/merchandise';

const rawApiUrl = (import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
export const API_ROOT = rawApiUrl.replace(/\/$/, '').replace(/\/api$/, '');
export const API_BASE_URL = `${API_ROOT}/api`;

export const getBackendVerifyUrl = (reference: string): string => {
  return `${API_ROOT}/api/payments/verify/${encodeURIComponent(reference)}`;
};

export const formatCurrency = (amount: number | string): string => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(num);
};

export const handleApiError = (error: any): { message: string; details?: any } => {
  console.error('API Error:', error);
  if (typeof error === 'string') return { message: error };
  if (error?.response?.data?.message) return { message: error.response.data.message, details: error.response.data };
  if (error?.message) return { message: error.message, details: error };
  return { message: 'An unexpected error occurred. Please try again.' };
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic JWT Authorization Header Interceptor matching BISUM
apiClient.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token || authUtils.getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    const token = authUtils.getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const registrationAPI = {
  /**
   * Initiates payment or completes registration via the Node.js backend
   */
  initiate: async (
    formData: any
  ): Promise<{
    success: boolean;
    message?: string;
    data?: {
      authorizationUrl?: string;
      accessCode?: string;
      reference?: string;
      registrationId?: string;
      registrationNumber?: string;
      registration?: Attendee;
    };
  }> => {
    try {
      const response = await apiClient.post('/registration/initiate', formData);
      return response.data;
    } catch (err: any) {
      if (err.response?.data) {
        return err.response.data;
      }
      throw err;
    }
  },

  /**
   * Retrieves registration status by reference
   */
  getStatus: async (reference: string): Promise<{ success: boolean; data?: Attendee; message?: string }> => {
    const response = await apiClient.get(`/registration/status/${encodeURIComponent(reference)}`);
    return response.data;
  },

  register: async (data: RegistrationData): Promise<{ success: boolean; attendee: Attendee }> => {
    const response = await apiClient.post('/registration/initiate', data);
    return response.data;
  },

  initializePayment: async (attendeeId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post(`/payments/initialize`, { attendeeId });
    return response.data;
  },

  verifyPayment: async (reference: string): Promise<{ status: string; success?: boolean; data?: any }> => {
    const response = await apiClient.get(`/payments/verify/${encodeURIComponent(reference)}`);
    return response.data;
  },
};

export const merchandiseAPI = {
  /**
   * Initiates merchandise checkout via the backend
   */
  initiate: async (orderData: any): Promise<{
    success: boolean;
    message?: string;
    data?: {
      authorizationUrl?: string;
      accessCode?: string;
      reference?: string;
      orderId?: string;
      totalAmount?: number;
    };
  }> => {
    const response = await apiClient.post('/merchandise/initiate', orderData);
    return response.data;
  },

  /**
   * Retrieves merchandise order status by reference
   */
  getStatus: async (reference: string) => {
    const response = await apiClient.get(`/merchandise/status/${encodeURIComponent(reference)}`);
    return response.data;
  },

  createOrder: async (orderData: OrderPayload) => {
    const response = await apiClient.post('/merchandise/initiate', {
      customerName: orderData.fullName,
      customerEmail: orderData.email,
      customerPhone: orderData.phoneNumber,
      itemId: orderData.merchandiseId,
      itemName: 'Official Merchandise',
      color: orderData.color,
      size: orderData.size,
      quantity: orderData.quantity,
      unitPrice: orderData.totalAmount / (orderData.quantity || 1),
      pickupOption: 'On-site Conference Pickup',
    });
    return response.data;
  },

  verifyMerchPayment: async (reference: string) => {
    const response = await apiClient.get(`/payments/verify/${encodeURIComponent(reference)}`);
    return response.data;
  },

  getMerchandiseOrders: async (params = {}, token: string) => {
    const response = await apiClient.get('/admin/merchandise/orders', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteMerchandiseOrder: async (token: string, orderId: string) => {
    const response = await apiClient.delete(`/admin/merchandise/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export const calculatePaystackFees = (amount: number): number => {
  const percentage = 0.015;
  const flatFee = 100;
  return amount > 0 ? Math.round(amount * percentage + flatFee) : 0;
};

// ── Dashboard & Admin API ────────────────────────────────────────────────────────────

export interface RegistrationFilters {
  page?: number;
  limit?: number;
  search?: string;
  attendanceMode?: string;
  status?: string;
  paymentStatus?: string;
  breakoutSession?: string;
  breakoutSessionChoice?: string;
  registrationType?: string;
}

export interface DashboardResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  orders?: T[];
  attendees?: T[];
}

export interface MerchandiseOrder {
  id?: string;
  orderNumber?: string;
  customerName?: string;
  fullName?: string;
  customerEmail?: string;
  email?: string;
  customerPhone?: string;
  phoneNumber?: string;
  itemId?: string;
  merchandiseId?: string;
  itemName?: string;
  color?: string;
  size?: string;
  quantity?: number;
  unitPrice?: number;
  totalAmount?: number;
  pickupOption?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  createdAt?: string;
}

export const dashboardAPI = {
  getStats: async (token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get('/admin/metrics', { headers });
    return response.data;
  },

  getRecentRegistrations: async (token: string, filters: RegistrationFilters = {}) => {
    const {
      page = 1,
      limit = 10,
      search,
      attendanceMode,
      paymentStatus,
      status,
      breakoutSessionChoice,
      breakoutSession,
      registrationType,
    } = filters;

    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;
    if (attendanceMode) params.attendanceMode = attendanceMode;
    if (paymentStatus || status) params.status = (paymentStatus || status) as string;
    if (breakoutSessionChoice || breakoutSession) params.breakoutSession = (breakoutSessionChoice || breakoutSession) as string;
    if (registrationType) params.registrationType = registrationType;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get('/admin/attendees', {
      params,
      headers,
    });

    const resData = response.data;
    const rawList = resData.data?.attendees || resData.data || [];
    
    // Normalize snake_case records from Bisum backend to both camelCase and snake_case
    const normalizedAttendees = rawList.map((r: any) => ({
      id: r.id,
      firstName: r.first_name || r.firstName || '',
      lastName: r.last_name || r.lastName || '',
      email: r.email || '',
      phoneNumber: r.phone || r.phoneNumber || '',
      phone: r.phone || r.phoneNumber || '',
      gender: r.gender,
      ageRange: r.age_range || r.ageRange,
      referralSource: r.referral_source || r.referralSource || '',
      breakoutSessionChoice: r.breakout_session_choice || r.breakoutSessionChoice || '',
      attendanceMode: r.attendance_mode || r.attendanceMode || 'On-site',
      expectations: r.expectations,
      registrationType: r.registration_type || r.registrationType || 'student',
      registrationNumber: r.registration_number || r.registrationNumber || '',
      paymentStatus: r.payment_status || r.paymentStatus || 'pending',
      amountPaid: r.amount_paid || r.amountPaid || 0,
      paymentReference: r.payment_reference || r.paymentReference,
      emailSent: r.email_sent || r.emailSent,
      createdAt: r.created_at || r.createdAt || '',
      updatedAt: r.updated_at || r.updatedAt || '',
    }));

    return {
      success: resData.success,
      attendees: normalizedAttendees,
      data: normalizedAttendees,
      total: resData.data?.total || resData.total || normalizedAttendees.length,
      totalPages: resData.data?.totalPages || resData.totalPages || 1,
      page: resData.data?.page || resData.page || page,
    };
  },

  deleteRegistration: async (token: string, registrationId: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.delete(`/admin/attendees/${registrationId}`, { headers });
    return response.data;
  },

  getMerchandiseOrders: async (
    token: string,
    filters: Record<string, string | number> = {}
  ): Promise<DashboardResponse<MerchandiseOrder>> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get('/admin/merchandise/orders', {
      params: filters,
      headers,
    });

    const resData = response.data;
    const rawList = resData.data?.orders || resData.data || [];

    // Normalize snake_case records from Bisum backend
    const normalizedOrders: MerchandiseOrder[] = rawList.map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number || o.orderNumber || '',
      customerName: o.customer_name || o.customerName || '',
      fullName: o.customer_name || o.customerName || '',
      customerEmail: o.customer_email || o.customerEmail || '',
      email: o.customer_email || o.customerEmail || '',
      customerPhone: o.customer_phone || o.customerPhone || '',
      phoneNumber: o.customer_phone || o.customerPhone || '',
      itemId: o.item_id || o.itemId || '',
      merchandiseId: o.item_id || o.itemId || '',
      itemName: o.item_name || o.itemName || '',
      color: o.color || '',
      size: o.size || '',
      quantity: o.quantity || 1,
      unitPrice: o.unit_price || o.unitPrice || 0,
      totalAmount: o.total_amount || o.totalAmount || 0,
      pickupOption: o.pickup_option || o.pickupOption || 'On-site Conference Pickup',
      paymentStatus: o.payment_status || o.paymentStatus || 'pending',
      fulfillmentStatus: o.fulfillment_status || o.fulfillmentStatus || 'unfulfilled',
      paymentReference: o.payment_reference || o.paymentReference,
      emailSent: o.email_sent || o.emailSent,
      createdAt: o.created_at || o.createdAt || '',
      updatedAt: o.updated_at || o.updatedAt || '',
    }));

    return {
      success: resData.success,
      data: normalizedOrders,
      orders: normalizedOrders,
      total: resData.data?.total || resData.total || normalizedOrders.length,
      page: resData.data?.page || resData.page || 1,
    };
  },

  deleteMerchandiseOrder: async (token: string, orderId: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.delete(`/admin/merchandise/orders/${orderId}`, { headers });
    return response.data;
  },
};
