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
  /**
   * Step 1: Send user data to Node.js backend to create a pending registration
   */
  register: async (data: RegistrationData): Promise<{ success: boolean; attendee: Attendee }> => {
    const response = await apiClient.post('/registrations', data);
    return response.data;
  },

  /**
   * Step 2: Initialize Paystack Payment
   * Your Node.js backend should call Paystack Initialize and return the access_code or authorization_url
   */
  initializePayment: async (attendeeId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post(`/payments/initialize`, { attendeeId });
    return response.data;
  },

  /**
   * Verify payment status after the popup closes
   */
  verifyPayment: async (reference: string): Promise<{ status: string }> => {
    const response = await apiClient.get(`/payments/verify/${reference}`);
    return response.data;
  }
};


  
export const merchandiseAPI = {
  /**
   * Step 1: Create a pending order in the Node.js backend
   */
  createOrder: async (orderData: OrderPayload) => {
    const response = await apiClient.post('/orders/merchandise', orderData);
    return response.data; // Should return { success: true, orderId: "...", accessCode: "..." }
  },

  /**
   * Verify a specific merchandise transaction
   */
  verifyMerchPayment: async (reference: string) => {
    const response = await apiClient.get(`/orders/verify/${reference}`);
    return response.data;
  }
};

/**
 * Utility to calculate Paystack charges if you want to show them on the UI
 * (Though it's safer to let the backend handle the final math)
 */
export const calculatePaystackFees = (amount: number): number => {
  const percentage = 0.025; // 2.5%
  const flatFee = amount > 2500 ? 100 : 0;
  const total = (amount + flatFee) / (1 - percentage);
  return Math.ceil(total - amount);
};