"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCms } from '../../context/CmsContext';
import ScrollToTopWidget from './widgets/ScrollToTopWidget';
import MapsWidget from './widgets/MapsWidget';
import WhatsAppWidget from './widgets/WhatsAppWidget';
import { botKnowledgeBase } from './widgets/ChatbotWidget';

const ChatbotWidget = dynamic(() => import('./widgets/ChatbotWidget'), {
  ssr: false,
});

export default function FloatingWidgets() {
  const { sections } = useCms();
  const widgetData = sections?.floatingWidgets || {};
  const locData = sections?.location || {};

  const [chatOpen, setChatOpen] = useState(false);

  // Configuration values
  const whatsappNumber = widgetData.whatsappNumber || "919718511207";
  const whatsappPrefill = widgetData.whatsappPrefill || "Hello Saudagar Properties, I am interested in luxury properties in DLF Gurugram.";
  const whatsappUrlLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappPrefill)}`;
  const gmapsUrl = locData.gmapsUrl || "https://www.google.com/maps/place/Saudagar+Properties+Pvt.Ltd/@28.4847851,77.0842655,17z";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": botKnowledgeBase.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      {/* INJECT KNOWLEDGE BASE AS SCHEMA FOR SEO/AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* LEFT SIDE WIDGETS */}
      <aside aria-label="Contact Links" className="fixed bottom-6 left-4 sm:left-6 z-[60] flex flex-col items-start gap-4 pointer-events-none">
        <MapsWidget gmapsUrl={gmapsUrl} />
        <WhatsAppWidget whatsappUrlLink={whatsappUrlLink} />
      </aside>

      {/* RIGHT SIDE WIDGETS */}
      <aside aria-label="Page Actions" className="fixed bottom-6 right-4 sm:right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        <ScrollToTopWidget isHidden={chatOpen} />
        <ChatbotWidget chatOpen={chatOpen} setChatOpen={setChatOpen} />
      </aside>
    </>
  );
}

