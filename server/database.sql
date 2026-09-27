-- =========================================================
-- PHOTIZO CONFERENCE - SUPABASE DATABASE SCHEMA
-- Run this script in the Supabase SQL Editor
-- =========================================================

-- 0. Registration Sequence for Sequential Pass Numbers (0001, 0002, ...)
CREATE SEQUENCE IF NOT EXISTS public.registration_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.get_next_registration_number()
RETURNS TEXT AS $$
DECLARE
    next_num BIGINT;
BEGIN
    next_num := nextval('public.registration_number_seq');
    RETURN LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 1. Create Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    gender VARCHAR(20),
    age_range VARCHAR(50),
    referral_source VARCHAR(100),
    breakout_session_choice VARCHAR(150),
    attendance_mode VARCHAR(50) DEFAULT 'On-site', -- 'On-site' or 'Online'
    expectations TEXT,
    registration_type VARCHAR(50) DEFAULT 'student', -- 'student' (1000 NGN) or 'professional' (2000 NGN)
    amount_paid NUMERIC(12, 2) DEFAULT 0.00,
    payment_status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    payment_reference VARCHAR(120),
    email_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe migration helper for existing tables
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='expectations') THEN
        ALTER TABLE public.registrations ADD COLUMN expectations TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='attendance_mode') THEN
        ALTER TABLE public.registrations ADD COLUMN attendance_mode VARCHAR(50) DEFAULT 'On-site';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='payment_reference') THEN
        ALTER TABLE public.registrations ADD COLUMN payment_reference VARCHAR(120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='email_sent') THEN
        ALTER TABLE public.registrations ADD COLUMN email_sent BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 2. Create Merchandise Orders Table
CREATE TABLE IF NOT EXISTS public.merchandise_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    color VARCHAR(50) NOT NULL,
    size VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    pickup_option VARCHAR(100) DEFAULT 'On-site Conference Pickup',
    payment_status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    fulfillment_status VARCHAR(30) DEFAULT 'unfulfilled', -- 'unfulfilled', 'ready', 'picked_up'
    payment_reference VARCHAR(120),
    email_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Payments Log Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(120) UNIQUE NOT NULL,
    paystack_id VARCHAR(100),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'success', 'failed'
    channel VARCHAR(50),
    metadata JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Admin Profiles Table (Associated with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'superadmin', 'viewer'
    is_approved BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_photizo_reg_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_photizo_reg_number ON public.registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_photizo_reg_status ON public.registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_photizo_reg_reference ON public.registrations(payment_reference);

CREATE INDEX IF NOT EXISTS idx_photizo_merch_email ON public.merchandise_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_photizo_merch_order_number ON public.merchandise_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_photizo_merch_status ON public.merchandise_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_photizo_merch_reference ON public.merchandise_orders(payment_reference);

CREATE INDEX IF NOT EXISTS idx_photizo_payments_ref ON public.payments(reference);
CREATE INDEX IF NOT EXISTS idx_photizo_payments_email ON public.payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_photizo_admin_user_id ON public.admin_users(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchandise_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1. Registrations Policies
DROP POLICY IF EXISTS "Allow public read for own registration by reg_number" ON public.registrations;
DROP POLICY IF EXISTS "Allow public insert for registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow public update for registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow authenticated admins full access to registrations" ON public.registrations;

CREATE POLICY "Allow public read for own registration by reg_number"
    ON public.registrations FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert for registrations"
    ON public.registrations FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update for registrations"
    ON public.registrations FOR UPDATE
    USING (true);

CREATE POLICY "Allow authenticated admins full access to registrations"
    ON public.registrations FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true
        )
    );

-- 2. Merchandise Orders Policies
DROP POLICY IF EXISTS "Allow public read for own merchandise order by order_number" ON public.merchandise_orders;
DROP POLICY IF EXISTS "Allow public insert for merchandise orders" ON public.merchandise_orders;
DROP POLICY IF EXISTS "Allow public update for merchandise orders" ON public.merchandise_orders;
DROP POLICY IF EXISTS "Allow authenticated admins full access to merchandise_orders" ON public.merchandise_orders;

CREATE POLICY "Allow public read for own merchandise order by order_number"
    ON public.merchandise_orders FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert for merchandise orders"
    ON public.merchandise_orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update for merchandise orders"
    ON public.merchandise_orders FOR UPDATE
    USING (true);

CREATE POLICY "Allow authenticated admins full access to merchandise_orders"
    ON public.merchandise_orders FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true
        )
    );

-- 3. Payments Policies
DROP POLICY IF EXISTS "Allow public insert for payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public update for payments" ON public.payments;
DROP POLICY IF EXISTS "Allow authenticated admins full access to payments" ON public.payments;

CREATE POLICY "Allow public insert for payments"
    ON public.payments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update for payments"
    ON public.payments FOR UPDATE
    USING (true);

CREATE POLICY "Allow authenticated admins full access to payments"
    ON public.payments FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true
        )
    );

-- 4. Admin Users Policies
DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON public.admin_users;

CREATE POLICY "Allow authenticated users to read admin_users"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (true);

-- =========================================================
-- 5. CREATE / SEED SUPERADMIN USER SCRIPT
-- Run this in the Supabase SQL Editor to create or reset the Super Admin
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    new_user_id UUID;
    admin_email TEXT := 'admin@photizo.org';           -- <--- REPLACE WITH YOUR ADMIN EMAIL
    admin_password TEXT := 'PhotizoAdminSecure2026!';  -- <--- REPLACE WITH YOUR ADMIN PASSWORD
    admin_name TEXT := 'Photizo Super Admin';
BEGIN
    -- Check if user already exists in auth.users
    SELECT id INTO new_user_id FROM auth.users WHERE email = admin_email;

    IF new_user_id IS NULL THEN
        -- Generate a new UUID
        new_user_id := gen_random_uuid();

        -- Insert into Supabase auth.users
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            '00000000-0000-0000-0000-000000000000',
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object('full_name', admin_name),
            'authenticated',
            'authenticated',
            NOW(),
            NOW()
        );

        -- Also create identity record in auth.identities
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            new_user_id,
            jsonb_build_object('sub', new_user_id::text, 'email', admin_email),
            'email',
            new_user_id::text,
            NOW(),
            NOW(),
            NOW()
        );
    ELSE
        -- Update password if user already exists
        UPDATE auth.users
        SET 
            encrypted_password = crypt(admin_password, gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW()
        WHERE id = new_user_id;
    END IF;

    -- Insert or update the public.admin_users profile
    INSERT INTO public.admin_users (
        user_id,
        email,
        full_name,
        role,
        is_approved,
        is_active,
        created_at
    ) VALUES (
        new_user_id,
        admin_email,
        admin_name,
        'superadmin',
        true,
        true,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
        role = 'superadmin',
        is_approved = true,
        is_active = true;

    RAISE NOTICE '✅ Superadmin created/updated successfully for % with User ID: %', admin_email, new_user_id;
END $$;
