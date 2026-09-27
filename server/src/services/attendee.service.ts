import { supabaseAdmin } from '../config/supabase';
import { Attendee } from '../types';

export const attendeeService = {
  /**
   * Generates sequential registration number like '0001', '0002', '0003'...
   */
  async generateRegistrationCode(): Promise<string> {
    try {
      // 1. Try invoking PostgreSQL sequence function via RPC
      const { data, error } = await supabaseAdmin.rpc('get_next_registration_number');
      if (!error && data) {
        return String(data).padStart(4, '0');
      }
    } catch (err) {
      // fallback if RPC is not registered
    }

    // 2. Fallback: Query all confirmed registration numbers to calculate the next sequence number
    const { data: attendees } = await supabaseAdmin
      .from('registrations')
      .select('registration_number')
      .not('registration_number', 'is', null);

    let maxNum = 0;
    if (attendees && attendees.length > 0) {
      for (const a of attendees) {
        if (a.registration_number) {
          const clean = a.registration_number.replace(/\D/g, '');
          const num = parseInt(clean, 10);
          if (!isNaN(num) && num > 0 && num < 100000) {
            if (num > maxNum) maxNum = num;
          }
        }
      }
      if (maxNum === 0) {
        maxNum = attendees.length;
      }
    }

    const nextNumber = maxNum + 1;
    return String(nextNumber).padStart(4, '0');
  },

  /**
   * Creates or updates a pending registration in the database without creating duplicate rows
   */
  async createPendingRegistration(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender?: string;
    ageRange?: string;
    referralSource?: string;
    breakoutSessionChoice?: string;
    attendanceMode?: string;
    expectations?: string;
    registrationType: 'student' | 'professional' | string;
    amountPaid: number;
    paymentReference: string;
  }) {
    const cleanEmail = payload.email.toLowerCase().trim();

    // 1. Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingUser) {
      // If already paid, prevent double registration
      if (existingUser.payment_status === 'paid') {
        throw new Error(
          `This email (${cleanEmail}) is already registered with Pass ID ${existingUser.registration_number}.`
        );
      }

      // If pending, UPDATE the existing record instead of creating a duplicate row
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from('registrations')
        .update({
          first_name: payload.firstName,
          last_name: payload.lastName,
          phone: payload.phone.trim(),
          gender: payload.gender,
          age_range: payload.ageRange,
          referral_source: payload.referralSource,
          breakout_session_choice: payload.breakoutSessionChoice,
          attendance_mode: payload.attendanceMode || 'On-site',
          expectations: payload.expectations,
          registration_type: payload.registrationType,
          amount_paid: payload.amountPaid,
          payment_reference: payload.paymentReference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      return updated;
    }

    // 2. Otherwise insert a fresh record
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert([
        {
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: cleanEmail,
          phone: payload.phone.trim(),
          gender: payload.gender,
          age_range: payload.ageRange,
          referral_source: payload.referralSource,
          breakout_session_choice: payload.breakoutSessionChoice,
          attendance_mode: payload.attendanceMode || 'On-site',
          expectations: payload.expectations,
          registration_type: payload.registrationType,
          amount_paid: payload.amountPaid,
          payment_status: 'pending',
          payment_reference: payload.paymentReference,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating pending registration:', error);
      throw error;
    }

    return data;
  },

  /**
   * Confirms payment and completes registration with sequential Pass ID (0001, 0002, ...)
   */
  async confirmRegistrationByReference(reference: string, amountPaid?: number) {
    // 1. Fetch current registration
    const { data: registration, error: fetchErr } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('payment_reference', reference)
      .single();

    if (fetchErr || !registration) {
      throw new Error(`Registration not found for reference: ${reference}`);
    }

    // If already confirmed, return existing registration
    if (registration.payment_status === 'paid' && registration.registration_number) {
      return registration;
    }

    // 2. Generate sequential registration code if not present (0001, 0002, ...)
    const regNumber = registration.registration_number || (await this.generateRegistrationCode());

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('registrations')
      .update({
        payment_status: 'paid',
        registration_number: regNumber,
        amount_paid: amountPaid !== undefined ? amountPaid : registration.amount_paid,
        updated_at: new Date().toISOString(),
      })
      .eq('id', registration.id)
      .select()
      .single();

    if (updateErr) {
      console.error('Error confirming registration:', updateErr);
      throw updateErr;
    }

    return updated;
  },

  /**
   * Confirms payment by ID (e.g. from Paystack metadata) with sequential Pass ID (0001, 0002, ...)
   */
  async confirmRegistrationById(id: string, amountPaid: number) {
    const { data: registration, error: fetchErr } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !registration) {
      throw new Error(`Registration not found for id: ${id}`);
    }

    if (registration.payment_status === 'paid' && registration.registration_number) {
      return registration;
    }

    const regNumber = registration.registration_number || (await this.generateRegistrationCode());

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('registrations')
      .update({
        payment_status: 'paid',
        registration_number: regNumber,
        amount_paid: amountPaid,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;
    return updated;
  },

  /**
   * Marks email as sent for attendee
   */
  async markEmailSent(id: string) {
    await supabaseAdmin.from('registrations').update({ email_sent: true }).eq('id', id);
  },

  /**
   * Retrieves an attendee by payment reference
   */
  async getByReference(reference: string) {
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('payment_reference', reference)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Retrieves an attendee by ID
   */
  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Paginated list and search for admin dashboard
   */
  async listAttendees(params: {
    search?: string;
    status?: string;
    registrationType?: string;
    breakoutSession?: string;
    attendanceMode?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from('registrations').select('*', { count: 'exact' });

    if (params.search) {
      const s = `%${params.search}%`;
      query = query.or(
        `first_name.ilike.${s},last_name.ilike.${s},email.ilike.${s},registration_number.ilike.${s},phone.ilike.${s},attendance_mode.ilike.${s}`
      );
    }

    if (params.status && params.status !== 'all') {
      query = query.eq('payment_status', params.status);
    }

    if (params.registrationType && params.registrationType !== 'all') {
      query = query.eq('registration_type', params.registrationType);
    }

    if (params.breakoutSession && params.breakoutSession !== 'all') {
      query = query.eq('breakout_session_choice', params.breakoutSession);
    }

    if (params.attendanceMode && params.attendanceMode !== 'all') {
      query = query.eq('attendance_mode', params.attendanceMode);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      attendees: (data || []).map((r: any) => ({
        id: r.id,
        firstName: r.first_name,
        lastName: r.last_name,
        email: r.email,
        phone: r.phone,
        phoneNumber: r.phone,
        gender: r.gender,
        ageRange: r.age_range,
        referralSource: r.referral_source,
        breakoutSessionChoice: r.breakout_session_choice,
        attendanceMode: r.attendance_mode,
        expectations: r.expectations,
        registrationType: r.registration_type,
        registrationNumber: r.registration_number,
        paymentStatus: r.payment_status,
        amountPaid: r.amount_paid,
        paymentReference: r.payment_reference,
        emailSent: r.email_sent,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  /**
   * Updates an attendee record (Admin)
   */
  async updateAttendee(id: string, updates: Partial<Attendee>) {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.firstName) payload.first_name = updates.firstName;
    if (updates.lastName) payload.last_name = updates.lastName;
    if (updates.email) payload.email = updates.email;
    if (updates.phone || (updates as any).phoneNumber) payload.phone = updates.phone || (updates as any).phoneNumber;
    if (updates.gender) payload.gender = updates.gender;
    if (updates.ageRange) payload.age_range = updates.ageRange;
    if (updates.breakoutSessionChoice) payload.breakout_session_choice = updates.breakoutSessionChoice;
    if (updates.attendanceMode) payload.attendance_mode = updates.attendanceMode;
    if (updates.registrationType) payload.registration_type = updates.registrationType;
    if (updates.paymentStatus) payload.payment_status = updates.paymentStatus;
    if (updates.expectations !== undefined) payload.expectations = updates.expectations;

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes an attendee record (Admin)
   */
  async deleteAttendee(id: string) {
    const { error } = await supabaseAdmin.from('registrations').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  /**
   * Dashboard Analytics & Metrics
   */
  async getDashboardAnalytics() {
    const [attendeesResult, paymentsResult] = await Promise.all([
      supabaseAdmin
        .from('registrations')
        .select(
          'id, payment_status, registration_type, breakout_session_choice, attendance_mode, amount_paid, created_at'
        ),
      supabaseAdmin.from('payments').select('id, amount, status, created_at'),
    ]);

    const attendees = attendeesResult.data || [];
    const payments = paymentsResult.data || [];

    const totalRegistrations = attendees.length;
    const paidRegistrations = attendees.filter((a) => a.payment_status === 'paid').length;
    const pendingRegistrations = attendees.filter((a) => a.payment_status === 'pending').length;

    const totalRevenue = attendees
      .filter((a) => a.payment_status === 'paid')
      .reduce((sum, a) => sum + (Number(a.amount_paid) || 0), 0);

    // Breakout sessions breakdown
    const sessionsMap: Record<string, number> = {};
    attendees.forEach((a) => {
      const choice = a.breakout_session_choice || 'General';
      sessionsMap[choice] = (sessionsMap[choice] || 0) + 1;
    });

    // Registration types breakdown
    const typesMap: Record<string, number> = {};
    attendees.forEach((a) => {
      const type = a.registration_type || 'student';
      typesMap[type] = (typesMap[type] || 0) + 1;
    });

    const studentCount = attendees.filter((a) => (a.registration_type || '').toLowerCase() === 'student').length;
    const professionalCount = attendees.filter((a) => (a.registration_type || '').toLowerCase() === 'professional').length;

    // Attendance mode breakdown (On-site vs Online)
    const onsiteCount = attendees.filter((a) => {
      const mode = (a.attendance_mode || 'On-site').toLowerCase();
      return mode === 'on-site' || mode === 'onsite' || mode === 'physical';
    }).length;
    const onlineCount = attendees.filter((a) => {
      const mode = (a.attendance_mode || '').toLowerCase();
      return mode === 'online' || mode === 'virtual';
    }).length;

    return {
      totalRegistrations,
      paidRegistrations,
      pendingRegistrations,
      studentCount,
      professionalCount,
      onsiteCount,
      onlineCount,
      totalRevenue,
      sessionsBreakdown: sessionsMap,
      typesBreakdown: typesMap,
      attendanceBreakdown: {
        'On-site': onsiteCount,
        'Online': onlineCount,
      },
      totalPaymentsCount: payments.length,
    };
  },
};
