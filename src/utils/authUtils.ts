/**
 * Authentication utilities for token management
 */

const TOKEN_KEY = 'dashboardToken';

export const authUtils = {
  /**
   * Check if user is authenticated (has a valid token)
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Store authentication token
   */
  setToken: (token: string): void => {
    if (!token) {
      console.warn('Attempted to set empty token');
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Retrieve stored authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Clear authentication token (logout)
   */
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Check token and return it, or null if not authenticated
   */
  getAuthHeader: (): { Authorization: string } | null => {
    const token = authUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : null;
  },
};
