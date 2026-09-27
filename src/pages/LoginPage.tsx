import React, { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Direct Supabase authentication (matches BISUM architecture)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (signInError) throw signInError;
      if (!data.user || !data.session?.access_token) {
        throw new Error('Authentication failed. No active session returned.');
      }

      // 2. Verify administrator privileges in public.admin_users
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminError || !adminData || !adminData.is_active) {
        await supabase.auth.signOut();
        throw new Error('Access restricted. This account does not have active administrator privileges.');
      }

      // 3. Pass the valid JWT token
      onLogin(data.session.access_token);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">⚡</div>
          <div className="login-logo-text">
            Photo<span>izo</span>
          </div>
        </div>

        <p className="login-tagline">
          Admin Dashboard — sign in to manage registrations, merchandise, and analytics.
        </p>

        {error && <div className="error-msg">{error}</div>}

        <div className="field">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@photizo.org"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            onKeyDown={onKey}
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            onKeyDown={onKey}
            autoComplete="current-password"
          />
        </div>

        <button 
          className="btn-primary" 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
