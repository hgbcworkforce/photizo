import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { dashboardAPI } from '../services/apiService';
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
    const isAuthenticated = authUtils.isAuthenticated();
    setSession(isAuthenticated);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call API login
      const response = await dashboardAPI.login({ email, password });

      // Expect token in response
      if (response && (response.token || response.accessToken)) {
        const token = response.token || response.accessToken;
        authUtils.setToken(token);
        setSession(true);
        // Clear form
        setEmail('');
        setPassword('');
      } else {
        throw new Error('Login successful but no token received.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setError(errorMessage);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-gray-600 text-xs tracking-widest uppercase">Loading...</div>
      </div>
    );
  }

  // Authenticated - render protected content
  if (session) {
    return <>{children}</>;
  }

  // Login form for unauthenticated users
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Admin Access</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Sign in to access the dashboard</p>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-300 mb-2 font-medium uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-2 font-medium uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-brand-orange text-white font-semibold rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}