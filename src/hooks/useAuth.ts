import { useState } from 'react';

export const useAuth = () => {
  // Define state type as string or null
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('photizo_token')
  );

  const login = (t: string) => {
    localStorage.setItem('photizo_token', t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem('photizo_token');
    setToken(null);
  };

  return { token, login, logout };
};
