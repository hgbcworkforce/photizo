import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { authUtils } from '../utils/authUtils';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [session, setSession] = useState<boolean | undefined>(undefined);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Check if already authenticated on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const storedToken = authUtils.getToken();
        if (storedToken) {
          setSession(true);
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) {
          authUtils.setToken(data.session.access_token);
          setSession(true);
        } else {
          setSession(false);
        }
      } catch (err) {
        setSession(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Direct Supabase authentication
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) throw signInError;
      if (!data.user || !data.session?.access_token) {
        throw new Error('Authentication failed. No active session returned.');
      }

      // 2. Verify admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminError || !adminData || !adminData.is_active) {
        await supabase.auth.signOut();
        throw new Error('Access restricted. This account does not have administrator privileges.');
      }

      // 3. Set token
      authUtils.setToken(data.session.access_token);
      setSession(true);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-gray-400 text-xs tracking-widest uppercase font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  // Authenticated - render protected content
  if (session) {
    return <>{children}</>;
  }

  // Login form for unauthenticated users
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 text-orange-600 font-black text-xl mb-2">
              ⚡
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Admin Portal</h2>
            <p className="text-slate-500 text-xs mt-1">Sign in with your Photizo administrator credentials</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-4 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@photizo.org"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}