"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../ui/PageLoader';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const timer = setTimeout(() => {
        router.replace('/admin/login');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return <PageLoader />;
  }

  return children;
}
