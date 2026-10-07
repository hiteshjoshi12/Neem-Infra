"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

// --- AEO / GEO OPTIMIZED KNOWLEDGE BASE ---
export const botKnowledgeBase = [
  { 
    id: "hours",
    keywords: ['time', 'open', 'hours', 'timing', 'close', 'days', 'weekend', 'sunday'],
    q: "What are your office timings?", 
    a: "Saudagar Properties is open Monday to Saturday, 10:00 AM to 7:00 PM. We also arrange special property visits on Sundays by prior appointment." 
  },
  { 
    id: "location",
    keywords: ['location', 'address', 'where', 'office', 'headquarters', 'visit', 'map'],
    q: "Where is Saudagar Properties located?", 
    a: "Our headquarters is located at 38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002. You can use the map widget on our site to get exact directions." 
  },
  { 
    id: "commercial",
    keywords: ['commercial', 'office space', 'retail', 'shop', 'udyog vihar', 'cyber city', 'business'],
    q: "Do you deal in commercial properties in Gurugram?", 
    a: "Yes, we have 25+ years of expertise in premium commercial real estate, including office spaces, retail shops, and industrial plots across Cyber City, Udyog Vihar, and Golf Course Road." 
  },
  { 
    id: "rera",
    keywords: ['rera', 'registered', 'legal', 'approved', 'compliance', 'safe'],
    q: "Are the properties you deal with RERA registered?", 
    a: "Absolutely. Saudagar Properties ensures that all new launches, builder floors, and commercial projects we advise on are fully RERA-compliant for your security and peace of mind." 
  },
  { 
    id: "areas",
    keywords: ['dlf', 'phase 1', 'phase 2', 'phase 3', 'phase 4', 'phase 5', 'sushant lok', 'areas', 'regions'],
    q: "Which areas in Gurugram do you specialize in?", 
    a: "We are the leading luxury real estate consultants for DLF Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, Sushant Lok, Golf Course Road, and Golf Course Extension." 
  },
  { 
    id: "types",
    keywords: ['builder floor', 'luxury', 'villa', 'apartment', 'penthouse', 'residential', 'house'],
    q: "What types of residential properties do you offer?", 
    a: "We specialize in ultra-luxury builder floors, independent villas, penthouses, and premium high-rise apartments from top developers like DLF, Emaar, and M3M." 
  },
  { 
    id: "buy",
    keywords: ['buy', 'purchase', 'invest', 'budget', 'price', 'cost', 'looking'],
    q: "How can I start the property buying process?", 
    a: "You can start by sharing your exact requirements and budget with us via WhatsApp or our Contact Form. Our founders will personally curate a list of properties that match your lifestyle." 
  },
  { 
    id: "sell",
    keywords: ['sell', 'listing', 'owner', 'brokerage', 'liquidate'],
    q: "Can you help me sell my property in Gurugram?", 
    a: "Yes! With our extensive HNI network and 25 years of goodwill, we can help you find the right buyer for your luxury residential or commercial property quickly and transparently." 
  }
];

const quickFaqs = [
  botKnowledgeBase[4], // Areas
  botKnowledgeBase[3], // RERA
  botKnowledgeBase[5]  // Types
];

export default function ChatbotWidget({ chatOpen, setChatOpen }) {
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hello! Welcome to Saudagar Properties. How can I help you today?' }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  const handleSendMessage = (e, text = null) => {
    if (e) e.preventDefault();
    
    const messageText = text || userInput;
    if (!messageText.trim()) return;

    setChatHistory(prev => [...prev, { sender: 'user', text: messageText }]);
    if (!text) setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = messageText.toLowerCase();
      let bestMatch = null;
      let highestScore = 0;

      for (const faq of botKnowledgeBase) {
        let score = 0;
        for (const keyword of faq.keywords) {
          if (lowerInput.includes(keyword)) {
            score++;
          }
        }
        if (score > highestScore) {
          highestScore = score;
          bestMatch = faq;
        }
      }

      const botReply = bestMatch 
        ? bestMatch.a 
        : "I'm still learning! For complex or highly specific property inquiries, please tap the WhatsApp icon to speak directly with our founders for immediate assistance.";

      setChatHistory(prev => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pointer-events-auto group relative flex items-center"
      >
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Toggle Chatbot"
          className="relative w-12 h-12 rounded-full bg-[#17213D] text-[#D09A16] flex items-center justify-center shadow-[0_10px_30px_rgba(29,38,59,0.5)] hover:shadow-[0_15px_35px_rgba(29,38,59,0.6)] border border-[#17213D] transition-all duration-300 hover:bg-[#D09A16] hover:text-[#17213D] hover:scale-105 active:scale-95 cursor-pointer z-50"
        >
          {chatOpen ? <X size={22} className="animate-in fade-in zoom-in" /> : <Bot size={22} className="animate-in fade-in zoom-in" />}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-[96px] right-4 sm:right-6 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#E8E4DA] z-[70] overflow-hidden flex flex-col pointer-events-auto"
            style={{ maxHeight: '600px', height: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#17213D] to-[#2a3652] p-4 flex items-center justify-between text-white shrink-0 shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot size={20} className="text-[#D09A16]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight tracking-wide">Saudagar Assistant</h3>
                  <p className="text-xs text-[#D09A16] flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-[#CBD5E1] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF8F5]">
              {chatHistory.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] sm:text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-[#1D263B] text-white rounded-br-sm shadow-sm' : 'bg-white text-[#475569] border border-[#E8E4DA] rounded-bl-sm shadow-sm'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-[13px] bg-white text-[#475569] border border-[#E8E4DA] rounded-bl-sm shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#CBD5E1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#CBD5E1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#CBD5E1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-[#E8E4DA] shrink-0">
              {/* Quick Questions Row (Hidden Scrollbar) */}
              <div className="p-3 border-b border-[#E8E4DA]/50 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex gap-2">
                  {quickFaqs.map((faq, idx) => (
                     <button 
                       key={idx}
                       onClick={() => handleSendMessage(null, faq.q)}
                       className="text-[11px] bg-[#FAF8F5] hover:bg-[#E8E4DA] text-[#1D263B] border border-[#E8E4DA] rounded-full px-3 py-1.5 transition-colors font-medium hover:shadow-sm"
                     >
                       {faq.q}
                     </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <form onSubmit={handleSendMessage} className="p-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 bg-[#FAF8F5] border border-[#E8E4DA] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#D09A16] focus:ring-1 focus:ring-[#D09A16] text-[#1D263B] transition-all"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim() || isTyping}
                  className="w-9 h-9 rounded-full bg-[#1D263B] text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a3652] transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
