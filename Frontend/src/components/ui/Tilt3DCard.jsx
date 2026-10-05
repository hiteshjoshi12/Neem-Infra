import { useRef, useEffect } from 'react';

export default function Tilt3DCard({ children, className = "", maxTilt = 8 }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    let isHovered = false;

    const resetCard = (smooth = true) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      card.style.transition = smooth
        ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'none';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (glare) {
        glare.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      isHovered = true;
      card.style.transition = 'transform 0.15s ease-out';
    };

    const handleMouseMove = (e) => {
      if (!isHovered) return;
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!card) return;
        const bounds = card.getBoundingClientRect();

        // If cursor is outside bounding rect during rapid movement or scroll
        if (
          clientX < bounds.left ||
          clientX > bounds.right ||
          clientY < bounds.top ||
          clientY > bounds.bottom
        ) {
          resetCard(true);
          return;
        }

        const x = clientX - bounds.left;
        const y = clientY - bounds.top;

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transition = 'transform 0.12s ease-out';
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

        if (glare) {
          glare.style.opacity = '0.2';
          glare.style.background = `radial-gradient(circle 250px at ${(x / bounds.width) * 100}% ${(y / bounds.height) * 100}%, rgba(255,255,255,0.7), transparent 70%)`;
        }
      });
    };

    const handleMouseLeave = () => {
      isHovered = false;
      resetCard(true);
    };

    const handleWindowScroll = () => {
      if (isHovered) {
        resetCard(true);
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      className={`relative transform-gpu will-change-transform ${className}`}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}

      {/* Hardware-Accelerated Specular Glare */}
      <div
        ref={glareRef}
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 overflow-hidden mix-blend-soft-light opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
