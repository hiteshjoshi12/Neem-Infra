import React from 'react';
import SeoPageEditor from '@/components/admin/SeoPageEditor';

export default async function EditSeoPage({ params }) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  const id = rawId ? decodeURIComponent(rawId) : null;

  return <SeoPageEditor pageId={id} isNew={false} />;
}
