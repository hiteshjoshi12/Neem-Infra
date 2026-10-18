"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    // When route changes, force scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname]);

  return null;
}
