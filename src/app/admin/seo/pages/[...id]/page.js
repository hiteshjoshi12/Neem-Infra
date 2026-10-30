import React from 'react';
import SeoPageEditor from '@/components/admin/SeoPageEditor';

export default async function EditSeoPage({ params }) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;

  let pageId = null;
  if (Array.isArray(rawId)) {
    // If it's a 24-hex MongoDB ObjectId passed as single segment
    if (rawId.length === 1 && /^[0-9a-fA-F]{24}$/.test(rawId[0])) {
      pageId = rawId[0];
    } else {
      // It's a slug path (e.g. ['services', 'residential'] or ['about'])
      const joined = rawId
        .map((seg) => decodeURIComponent(seg).replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/');
      pageId = joined ? `/${joined}` : '/';
    }
  } else if (typeof rawId === 'string' && rawId.trim()) {
    pageId = decodeURIComponent(rawId);
  }

  return <SeoPageEditor pageId={pageId} isNew={false} />;
}
