"use client";

import React, { useEffect, useState, useRef } from 'react';

/**
 * Ultra-lightweight 120 FPS Animated Counter
 * - Uses IntersectionObserver + requestAnimationFrame
 * - 0 heavy dependencies, 0 lag, zero CPU usage when stationary
 * - Supports prefix (e.g. '₹'), suffix (e.g. '+', 'Cr+'), and comma formatting
 */
export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1800,
  formatComma = false,
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  // Parse numeric target
  const targetNumber = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCount();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    function animateCount() {
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth ease-out cubic curve (starts fast, glides softly into final number)
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(targetNumber * ease);

        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setDisplayValue(targetNumber);
        }
      }

      requestAnimationFrame(update);
    }

    return () => {
      observer.disconnect();
    };
  }, [targetNumber, duration]);

  const formattedNumber = formatComma ? displayValue.toLocaleString('en-IN') : displayValue;

  return (
    <span ref={elementRef} className={`inline-block tabular-nums ${className}`}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}
