import axios from 'axios';
import { env } from '../config/env';
import { PaystackInitResponse, PaystackVerifyResponse } from '../types';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const paystackService = {
  /**
   * Initializes a transaction with Paystack
   * @param params Transaction initialization parameters
   */
  async initializeTransaction(params: {
    email: string;
    amount: number; // in NGN (will be converted to kobo)
    reference: string;
    callbackUrl?: string;
    channels?: string[];
    metadata?: Record<string, any>;
  }): Promise<PaystackInitResponse> {
    try {
      const response = await axios.post<PaystackInitResponse>(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: params.email,
          amount: Math.round(params.amount * 100), // Paystack accepts amount in kobo
          reference: params.reference,
          callback_url: params.callbackUrl || `${env.FRONTEND_URL}/payment/callback`,
          metadata: params.metadata || {},
          channels: params.channels || [
            'card',
            'bank',
            'ussd',
            'qr',
            'mobile_money',
            'bank_transfer',
            'eft',
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack Initialization Error:', error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || 'Failed to initialize Paystack payment');
    }
  },

  /**
   * Verifies a transaction reference directly with Paystack API
   * @param reference Transaction reference string
   */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await axios.get<PaystackVerifyResponse>(
        `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack Verification Error:', error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || 'Failed to verify transaction with Paystack');
    }
  },
};
