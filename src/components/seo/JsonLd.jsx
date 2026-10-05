"use client";

import { useEffect, useId } from 'react';

/**
 * JsonLd — Inject JSON-LD structured data into the <head>
 * ========================================================
 * Renders a <script type="application/ld+json"> tag with the provided data.
 * Automatically cleans up on unmount.
 *
 * Usage:
 *   <JsonLd data={{
 *     "@context": "https://schema.org",
 *     "@type": "Organization",
 *     "name": "Saudagar Properties"
 *   }} />
 */
export default function JsonLd({ data }) {
  const id = useId();
  const scriptId = `jsonld-${id}`;

  useEffect(() => {
    if (!data) return;

    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [data, scriptId]);

  return null;
}
