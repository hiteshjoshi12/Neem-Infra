import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('saudagar_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Check token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.data) {
          setAdmin(res.data);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('[AuthContext] Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        const { token: newToken, ...adminData } = res.data;
        localStorage.setItem('saudagar_admin_token', newToken);
        setToken(newToken);
        setAdmin(adminData);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error or invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('saudagar_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
