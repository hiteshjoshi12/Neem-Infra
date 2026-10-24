"use client";

import { CmsProvider } from '../context/CmsContext';

export default function Providers({ children, initialData }) {
  return (
    <CmsProvider initialData={initialData}>
      {children}
    </CmsProvider>
  );
}

