"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('saudagar_admin_token') || null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('saudagar_admin_token');
    }
    setToken(null);
    setAdmin(null);
  }, []);

  // Check token on mount
  useEffect(() => {
    let isMounted = true;
    const verifyAuth = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (isMounted) {
          if (res.success && res.data) {
            setAdmin(res.data);
          } else {
            logout();
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Session expired or invalid token:', err?.message);
        if (isMounted) logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        const { token: newToken, ...adminData } = res.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('saudagar_admin_token', newToken);
        }
        setToken(newToken);
        setAdmin(adminData);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error or invalid credentials' };
    }
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
