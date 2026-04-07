import React, { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { dashboardAPI } from "../../services/apiService";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

// Ensure this matches the structure your backend returns
interface LoginResponse {
  token?: string;
  accessToken?: string;
  data?: {
    token: string;
  };
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
      // dashboardAPI.login should accept an object with email and password
      const data = await dashboardAPI.login({ email, password }) as LoginResponse;

      const token = data.token || data.accessToken || data.data?.token;

      if (token) {
        onLogin(token);
      } else {
        throw new Error('No token returned');
      }
    } catch (err: any) {
      // Handle axios errors or generic errors
      const message = err.response?.data?.message || 'Invalid credentials or server error.';
      setError(message);
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
            placeholder="admin@example.com"
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
