"use client";

import { CmsProvider } from '../context/CmsContext';

export default function Providers({ children }) {
  return (
    <CmsProvider>
      {children}
    </CmsProvider>
  );
}

