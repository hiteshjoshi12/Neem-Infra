"use client";
import React, { useEffect, useState } from 'react';
import BlogEditor from '@/components/admin/BlogEditor';
import { useParams } from 'next/navigation';
import api from '@/services/api';

export default function EditBlogPostPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getBlog(id);
        if (res.success) {
          // Reformat arrays to just hold IDs for selects
          const formatToId = (val) => val ? (val._id || val) : '';
          const formatArray = (arr) => Array.isArray(arr) ? arr.map(formatToId) : [];
          
          const formatted = {
            ...res.data,
            author: formatToId(res.data.author),
            category: formatToId(res.data.category),
            tags: formatArray(res.data.tags),
            location: formatArray(res.data.location),
            propertyType: formatArray(res.data.propertyType)
          };
          setData(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading editor...</div>;
  if (!data) return <div className="p-10 text-center text-red-400">Post not found</div>;

  return <BlogEditor isEdit={true} initialData={data} />;
}
