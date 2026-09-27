import axios from 'axios';
import type { RegistrationData, Attendee, PaymentResponse } from '../types/registration';
import type { OrderPayload } from '../types/merchandise';

export const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_ROOT = API_BASE_URL.replace(/\/$/, '').replace(/\/api$/, '');

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
  paymentStatus?: string;
  fulfillmentStatus?: string;
  createdAt?: string;
}

export const dashboardAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (token: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post(
      '/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getStats: async (token: string) => {
    const response = await apiClient.get('/admin/metrics', {
      headers: { Authorization: `Bearer ${token}` },
    });
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

    const response = await apiClient.get('/admin/attendees', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });

    // Normalize response for dashboard tables
    const resData = response.data;
    return {
      success: resData.success,
      attendees: resData.data?.attendees || resData.data || [],
      data: resData.data?.attendees || resData.data || [],
      total: resData.data?.total || 0,
      totalPages: resData.data?.totalPages || 1,
      page: resData.data?.page || page,
    };
  },

  deleteRegistration: async (token: string, registrationId: string) => {
    const response = await apiClient.delete(`/admin/attendees/${registrationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getMerchandiseOrders: async (
    token: string,
    filters: Record<string, string | number> = {}
  ): Promise<DashboardResponse<MerchandiseOrder>> => {
    const response = await apiClient.get('/admin/merchandise/orders', {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });

    const resData = response.data;
    return {
      success: resData.success,
      data: resData.data?.orders || resData.data || [],
      orders: resData.data?.orders || resData.data || [],
      total: resData.data?.total || 0,
      page: resData.data?.page || 1,
    };
  },

  deleteMerchandiseOrder: async (token: string, orderId: string) => {
    const response = await apiClient.delete(`/admin/merchandise/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
