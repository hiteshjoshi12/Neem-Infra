"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import SeoPageEditor from '@/components/admin/SeoPageEditor';

export default function EditSeoPage() {
  const params = useParams();
  const id = params?.id;

  return <SeoPageEditor pageId={id} isNew={false} />;
}
