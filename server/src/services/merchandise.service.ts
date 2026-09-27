import { supabaseAdmin } from '../config/supabase';
import { MerchandiseOrder } from '../types';

export const merchandiseService = {
  /**
   * Generates a unique merchandise order code
   */
  generateOrderCode(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `PHOTIZO-ORD-2026-${randomDigits}`;
  },

  /**
   * Creates a pending merchandise order in Supabase
   */
  async createPendingOrder(payload: {
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
    paymentReference: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('merchandise_orders')
      .insert([
        {
          customer_name: payload.customerName.trim(),
          customer_email: payload.customerEmail.toLowerCase().trim(),
          customer_phone: payload.customerPhone.trim(),
          item_id: payload.itemId,
          item_name: payload.itemName,
          color: payload.color,
          size: payload.size,
          quantity: payload.quantity,
          unit_price: payload.unitPrice,
          total_amount: payload.totalAmount,
          pickup_option: payload.pickupOption || 'On-site Conference Pickup',
          payment_status: 'pending',
          fulfillment_status: 'unfulfilled',
          payment_reference: payload.paymentReference,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating pending merchandise order:', error);
      throw error;
    }

    return data;
  },

  /**
   * Confirms a merchandise order by payment reference
   */
  async confirmOrderByReference(reference: string, amountPaid?: number) {
    const { data: order, error: fetchErr } = await supabaseAdmin
      .from('merchandise_orders')
      .select('*')
      .eq('payment_reference', reference)
      .single();

    if (fetchErr || !order) {
      throw new Error(`Merchandise order not found for reference: ${reference}`);
    }

    if (order.payment_status === 'paid' && order.order_number) {
      return order;
    }

    const orderNumber = order.order_number || this.generateOrderCode();

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('merchandise_orders')
      .update({
        payment_status: 'paid',
        order_number: orderNumber,
        total_amount: amountPaid !== undefined ? amountPaid : order.total_amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)
      .select()
      .single();

    if (updateErr) throw updateErr;
    return updated;
  },

  /**
   * Confirms a merchandise order by database ID
   */
  async confirmOrderById(id: string, amountPaid: number) {
    const { data: order, error: fetchErr } = await supabaseAdmin
      .from('merchandise_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !order) {
      throw new Error(`Merchandise order not found for id: ${id}`);
    }

    if (order.payment_status === 'paid' && order.order_number) {
      return order;
    }

    const orderNumber = order.order_number || this.generateOrderCode();

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('merchandise_orders')
      .update({
        payment_status: 'paid',
        order_number: orderNumber,
        total_amount: amountPaid,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;
    return updated;
  },

  /**
   * Marks email as sent for order
   */
  async markEmailSent(id: string) {
    await supabaseAdmin.from('merchandise_orders').update({ email_sent: true }).eq('id', id);
  },

  /**
   * Retrieves order by reference
   */
  async getByReference(reference: string) {
    const { data, error } = await supabaseAdmin
      .from('merchandise_orders')
      .select('*')
      .eq('payment_reference', reference)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Retrieves order by ID
   */
  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('merchandise_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Lists merchandise orders for admin dashboard
   */
  async listOrders(params: {
    search?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
    itemId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from('merchandise_orders').select('*', { count: 'exact' });

    if (params.search) {
      const s = `%${params.search}%`;
      query = query.or(
        `order_number.ilike.${s},customer_name.ilike.${s},customer_email.ilike.${s},customer_phone.ilike.${s}`
      );
    }

    if (params.paymentStatus && params.paymentStatus !== 'all') {
      query = query.eq('payment_status', params.paymentStatus);
    }

    if (params.fulfillmentStatus && params.fulfillmentStatus !== 'all') {
      query = query.eq('fulfillment_status', params.fulfillmentStatus);
    }

    if (params.itemId && params.itemId !== 'all') {
      query = query.eq('item_id', params.itemId);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      orders: (data || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.customer_name,
        fullName: o.customer_name,
        customerEmail: o.customer_email,
        email: o.customer_email,
        customerPhone: o.customer_phone,
        phoneNumber: o.customer_phone,
        itemId: o.item_id,
        merchandiseId: o.item_id,
        itemName: o.item_name,
        color: o.color,
        size: o.size,
        quantity: o.quantity,
        unitPrice: o.unit_price,
        totalAmount: o.total_amount,
        pickupOption: o.pickup_option,
        paymentStatus: o.payment_status,
        fulfillmentStatus: o.fulfillment_status,
        paymentReference: o.payment_reference,
        emailSent: o.email_sent,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      })),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  /**
   * Updates merchandise order status (Admin)
   */
  async updateOrder(id: string, updates: Partial<MerchandiseOrder>) {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.fulfillmentStatus) payload.fulfillment_status = updates.fulfillmentStatus;
    if (updates.paymentStatus) payload.payment_status = updates.paymentStatus;
    if (updates.color) payload.color = updates.color;
    if (updates.size) payload.size = updates.size;
    if (updates.quantity) payload.quantity = updates.quantity;

    const { data, error } = await supabaseAdmin
      .from('merchandise_orders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a merchandise order (Admin)
   */
  async deleteOrder(id: string) {
    const { error } = await supabaseAdmin.from('merchandise_orders').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
