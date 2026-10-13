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

  return (
    <Component className={`font-serif tracking-tight leading-tight ${className}`}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-10%" }}
        variants={containerVariants}
        className="inline-block"
      >
        {words.map((word, idx) => (
          <span key={idx} className="inline-block overflow-hidden mr-[0.26em] align-top">
            <motion.span
              variants={wordVariants}
              className="inline-block origin-bottom"
            >
              {word}
            </motion.span>
          </span>
        ))}

        {highlightText && (
          <span className="inline-block overflow-hidden align-top">
            <motion.span
              variants={wordVariants}
              className="inline-block italic text-[#D09A16] font-serif font-normal"
            >
              {highlightText}
            </motion.span>
          </span>
        )}
      </motion.span>
    </Component>
  );
}
