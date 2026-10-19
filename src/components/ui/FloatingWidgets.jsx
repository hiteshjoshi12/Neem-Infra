"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useCms } from '../../context/CmsContext';
import { MapPin, X } from 'lucide-react';
import ScrollToTopWidget from './widgets/ScrollToTopWidget';
import MapsWidget from './widgets/MapsWidget';
import WhatsAppWidget from './widgets/WhatsAppWidget';
import { botKnowledgeBase } from './widgets/ChatbotWidget';

const ChatbotWidget = dynamic(() => import('./widgets/ChatbotWidget'), { ssr: false });

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

  const [showLeftWidgets, setShowLeftWidgets] = useState(false);

  return (
    <>

      {/* LEFT SIDE WIDGETS (Expandable FAB) */}
      <aside aria-label="Contact Links" className="fixed bottom-6 left-4 sm:left-6 z-[60] flex flex-col items-start gap-3 pointer-events-none">
        <AnimatePresence>
          {showLeftWidgets && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-start gap-3 pointer-events-auto origin-bottom-left"
            >
              <MapsWidget gmapsUrl={gmapsUrl} />
              <WhatsAppWidget whatsappUrlLink={whatsappUrlLink} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setShowLeftWidgets(!showLeftWidgets)}
          aria-label="Toggle Quick Contacts"
          className="w-12 h-12 rounded-full bg-brand-navy text-brand-gold border border-brand-navy flex items-center justify-center shadow-2xl pointer-events-auto hover:bg-brand-gold hover:text-brand-navy hover:scale-105 transition-all duration-300"
        >
          {showLeftWidgets ? <X size={22} /> : <MapPin size={22} className="fill-brand-gold/20" />}
        </button>
      </aside>

      {/* RIGHT SIDE WIDGETS */}
      <aside aria-label="Page Actions" className="fixed bottom-6 right-4 sm:right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        <ScrollToTopWidget isHidden={chatOpen} />
        <React.Suspense fallback={null}>
          <ChatbotWidget chatOpen={chatOpen} setChatOpen={setChatOpen} />
        </React.Suspense>
      </aside>
    </>
  );
}

