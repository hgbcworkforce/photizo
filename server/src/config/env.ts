import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url({ message: 'SUPABASE_URL must be a valid URL' }),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, { message: 'SUPABASE_SERVICE_ROLE_KEY is required' }),
  PAYSTACK_SECRET_KEY: z.string().min(1, { message: 'PAYSTACK_SECRET_KEY is required' }),
  PAYSTACK_PUBLIC_KEY: z.string().optional().default(''),
  RESEND_API_KEY: z.string().min(1, { message: 'RESEND_API_KEY is required' }),
  RESEND_FROM_EMAIL: z.string().default('Photizo Conference <onboarding@resend.dev>'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  CONFERENCE_NAME: z.string().default('Photizo Conference 2026'),
  CONFERENCE_DATES: z.string().default('May 21 - 23, 2026'),
  CONFERENCE_VENUE: z.string().default('Higher Ground Baptist Church, Ogbomoso, Nigeria.'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid or missing backend environment variables:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = _env.success
  ? _env.data
  : {
      PORT: process.env.PORT || '5000',
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development',
      SUPABASE_URL: process.env.SUPABASE_URL || 'https://mock.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key',
      PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock',
      PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_mock',
      RESEND_API_KEY: process.env.RESEND_API_KEY || 're_mock',
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'Photizo Conference <onboarding@resend.dev>',
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
      CONFERENCE_NAME: 'Photizo Conference 2026',
      CONFERENCE_DATES: 'May 21 - 23, 2026',
      CONFERENCE_VENUE: 'Higher Ground Baptist Church, Ogbomoso, Nigeria.',
    };
