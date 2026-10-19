"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * LuxuryTextReveal
 * ============================================================================
 * Hooky, high-end editorial text animation for headings.
 * Splitting words into masked sliding lines with a custom luxury cubic-bezier curve.
 * Draws customer attention cleanly without tacky card slides.
 */
export default function LuxuryTextReveal({
  text = "",
  highlightText = "",
  className = "",
  as: Component = "h2",
  delay = 0.1,
  once = true
}) {
  const words = text ? text.trim().split(/\s+/) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: "115%",
      opacity: 0,
      rotateX: 18,
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Luxury Apple/Editorial cubic bezier
      },
    },
  };

  const highlightWords = highlightText ? highlightText.trim().split(/\s+/) : [];

  return (
    <Component className={`font-serif tracking-tight leading-tight ${className}`}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.05 }}
        variants={containerVariants}
        className="inline-block"
      >
        {words.map((word, idx) => (
          <span key={`w-${idx}`} className="inline-block overflow-hidden mr-[0.26em] align-top">
            <motion.span
              variants={wordVariants}
              className="inline-block origin-bottom"
            >
              {word}
            </motion.span>
          </span>
        ))}

        {highlightWords.map((word, idx) => (
          <span key={`h-${idx}`} className="inline-block overflow-hidden mr-[0.28em] pr-2 -mr-1 align-top">
            <motion.span
              variants={wordVariants}
              className="inline-block italic text-brand-gold font-serif font-bold tracking-normal"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}
