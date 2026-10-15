'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Root layout critical error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0E162B', color: '#F7F5EF', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(208,154,22,0.3)', color: '#D09A16', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>
              System Alert • Root Error
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#F7F5EF' }}>
              Something Went Wrong
            </h1>
            <p style={{ fontSize: '14px', color: '#C9CED9', lineHeight: 1.6, marginBottom: '28px' }}>
              A critical failure occurred. Please refresh the page or return to the main portal.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => reset()}
                style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: '#D09A16', color: '#0E162B', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}
              >
                Reload Application
              </button>
              <Link
                href="/"
                style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: '#17213D', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center' }}
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
