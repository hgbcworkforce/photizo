import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = (
  import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  ''
).trim();

const supabaseAnonKey: string = (
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

let supabaseClient: SupabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } else {
    supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
  }
} catch (error) {
  console.warn('Supabase client initialized with fallback config:', error);
  supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
}

export const supabase = supabaseClient;
