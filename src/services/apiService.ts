import axios from 'axios';
import type { RegistrationData, Attendee, PaymentResponse } from '../types/registration';
import type { OrderPayload } from '../types/merchandise';

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registrationAPI = {
  register: async (data: RegistrationData): Promise<{ success: boolean; attendee: Attendee }> => {
    const response = await apiClient.post('/registrations', data);
    return response.data;
  },

  initializePayment: async (attendeeId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post(`/payments/initialize`, { attendeeId });
    return response.data;
  },

  verifyPayment: async (reference: string): Promise<{ status: string }> => {
    const response = await apiClient.get(`/payments/verify/${reference}`);
    return response.data;
  },
};

export const merchandiseAPI = {
  createOrder: async (orderData: OrderPayload) => {
    const response = await apiClient.post('/orders/merchandise', orderData);
    return response.data;
  },

  verifyMerchPayment: async (reference: string) => {
    const response = await apiClient.get(`/orders/verify/${reference}`);
    return response.data;
  },

  getMerchandiseOrders: async (params = {}, token: string) => {
    const response = await apiClient.get('/orders/merchandise', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export const calculatePaystackFees = (amount: number): number => {
  const percentage = 0.025;
  const flatFee = amount > 2500 ? 100 : 0;
  const total = (amount + flatFee) / (1 - percentage);
  return Math.ceil(total - amount);
};

// ── Dashboard API ────────────────────────────────────────────────────────────

export interface RegistrationFilters {
  page?: number;
  limit?: number;
  search?: string;
  attendanceMode?: string;         // 'Physical' | 'Virtual'
  paymentStatus?: string;          // 'complete' | 'pending'
  breakoutSessionChoice?: string;
}

export interface DashboardResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  orders?: T[]; // For merchandise orders, if backend uses a different key
}

export interface MerchandiseOrder {
  merchandiseId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  color: string;
  size: string;
  quantity: number;
  totalAmount: number;
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
    const response = await apiClient.get('/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Fetch registrations with full filter + pagination support.
   * Only non-empty values are forwarded so the backend isn't
   * confused by empty strings.
   */
  getRecentRegistrations: async (token: string, filters: RegistrationFilters = {}) => {
    const {
      page = 1,
      limit = 10,
      search,
      attendanceMode,
      paymentStatus,
      breakoutSessionChoice,
    } = filters;

    const params: Record<string, string | number> = { page, limit };
    if (search)                params.search                = search;
    if (attendanceMode)        params.attendanceMode        = attendanceMode;
    if (paymentStatus)         params.paymentStatus         = paymentStatus;
    if (breakoutSessionChoice) params.breakoutSessionChoice = breakoutSessionChoice;

    const response = await apiClient.get('/registrations', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getMerchandiseOrders: async (
    token: string,
    filters: Record<string, string | number> = {}
  ): Promise<DashboardResponse<MerchandiseOrder>> => {
    const response = await apiClient.get('/orders/merchandise', {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
