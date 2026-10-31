"use client";

import { CmsProvider } from '../context/CmsContext';
import { ToastProvider } from './ui/Toast';

export default function Providers({ children, initialData }) {
  return (
    <ToastProvider>
      <CmsProvider initialData={initialData}>
        {children}
      </CmsProvider>
    </ToastProvider>
  );
}
