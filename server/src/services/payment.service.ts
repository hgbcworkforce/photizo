import { supabaseAdmin } from '../config/supabase';
import { PaymentRecord } from '../types';

export const paymentService = {
  /**
   * Records or updates a payment log in Supabase
   */
  async recordPayment(payment: {
    reference: string;
    paystackId?: string;
    customerName?: string;
    customerEmail: string;
    amount: number;
    currency?: string;
    status: 'pending' | 'success' | 'failed' | 'abandoned';
    channel?: string;
    metadata?: Record<string, any>;
    paidAt?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .upsert(
        {
          reference: payment.reference,
          paystack_id: payment.paystackId,
          customer_name: payment.customerName,
          customer_email: payment.customerEmail.toLowerCase().trim(),
          amount: payment.amount,
          currency: payment.currency || 'NGN',
          status: payment.status,
          channel: payment.channel,
          metadata: payment.metadata,
          paid_at: payment.paidAt,
        },
        { onConflict: 'reference' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error recording payment:', error);
      throw error;
    }

    return data;
  },

  /**
   * Retrieves a payment by its reference
   */
  async getByReference(reference: string) {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Lists payments with pagination & filters (Admin)
   */
  async listPayments(params: { search?: string; status?: string; page?: number; limit?: number }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from('payments').select('*', { count: 'exact' });

    if (params.search) {
      const s = `%${params.search}%`;
      query = query.or(`reference.ilike.${s},customer_email.ilike.${s},customer_name.ilike.${s}`);
    }

    if (params.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      payments: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },
};
