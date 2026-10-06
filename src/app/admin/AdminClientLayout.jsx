"use client";

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function AdminClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      {pathname === '/admin/login' ? (
        children
      ) : (
        <ProtectedRoute>
          <AdminLayout>
            {children}
          </AdminLayout>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
