
import { animate, inView, stagger } from 'framer-motion';

const dummyTimeline = { 
  to: function(target, vars) { gsap.to(target, vars); return this; }, 
  from: function() { return this; }, 
  fromTo: function(target, fromVars, toVars) { gsap.fromTo(target, fromVars, toVars); return this; } 
};
const gsap = { 
  to: (target, vars) => {
    if (!target) return;
    try {
      const options = { duration: vars.duration || 0.4, delay: vars.delay || 0 };
      if (vars.stagger) options.delay = stagger(vars.stagger);
      const safeVars = { ...vars };
      ['duration','delay','stagger','ease','scrollTrigger','clearProps','transformPerspective','transformStyle'].forEach(p => delete safeVars[p]);
      
      const elements = Array.isArray(target) ? target.filter(Boolean) : (typeof target === 'string' || target instanceof Element ? target : null);
      if (!elements || (Array.isArray(elements) && elements.length === 0)) return;

      if (vars.scrollTrigger) {
         inView(vars.scrollTrigger.trigger || (Array.isArray(elements) ? elements[0] : elements), () => { animate(elements, safeVars, options); }, { once: true, margin: "0px 0px -10% 0px" });
      } else {
         animate(elements, safeVars, options);
      }
    } catch(e){}
  }, 
  from: () => {}, 
  fromTo: (target, fromVars, toVars) => {
    if (!target) return;
    try {
      const options = { duration: toVars.duration || 1, delay: toVars.delay || 0 };
      if (toVars.stagger) options.delay = stagger(toVars.stagger);
      const safeFrom = { ...fromVars }; const safeTo = { ...toVars };
      ['duration','delay','stagger','ease','scrollTrigger','clearProps','transformPerspective','transformStyle'].forEach(p => { delete safeFrom[p]; delete safeTo[p]; });
      
      const elements = Array.isArray(target) ? target.filter(Boolean) : (typeof target === 'string' || target instanceof Element ? target : null);
      if (!elements || (Array.isArray(elements) && elements.length === 0)) return;
      
      animate(elements, safeFrom, { duration: 0 });
      if (toVars.scrollTrigger) {
         inView(toVars.scrollTrigger.trigger || (Array.isArray(elements) ? elements[0] : elements), () => { animate(elements, safeTo, options); }, { once: true, margin: "0px 0px -10% 0px" });
      } else {
         animate(elements, safeTo, options);
      }
    } catch(e){}
  }, 
  context: (cb) => { if(cb) { try { cb(); } catch(e){} } return { revert: () => {} }; }, 
  registerPlugin: () => {},
  timeline: () => dummyTimeline 
};
const ScrollTrigger = {};


/**
 * Creates a smooth luxury scroll reveal on a single target or group.
 */
export function scrollFadeUp(element, options = {}) {
  if (!element) return null;
  const {
    delay = 0,
    duration = 1,
    y = 40,
    ease = "power3.out",
    trigger = element,
    start = "top 88%",
    toggleActions = "play none none none"
  } = options;

  return gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger,
        start,
        toggleActions,
        once: true
      },
      clearProps: "transform"
    }
  );
}

/**
 * Creates a staggered 3D entrance for card grids on scroll.
 */
export function scrollStaggerCards(container, cardElements, options = {}) {
  if (!container || !cardElements || cardElements.length === 0) return null;
  const {
    duration = 1.1,
    stagger = 0.15,
    y = 60,
    rotateX = 20,
    ease = "power3.out",
    start = "top 85%"
  } = options;

  return gsap.fromTo(
    cardElements,
    {
      opacity: 0,
      y,
      rotateX,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: container,
        start,
        once: true
      },
      clearProps: "transform"
    }
  );
}

/**
 * Subtle parallax effect tied to scroll scrubbing.
 */
export function scrollParallax(element, options = {}) {
  if (!element) return null;
  const { yPercent = -15, trigger = element, start = "top bottom", end = "bottom top" } = options;

  return gsap.to(element, {
    yPercent,
    ease: "none",
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: 1.2
    }
  });
}

/**
 * Interactive 3D tilt handler using GSAP physics.
 */
export function attach3DTilt(cardElement, maxTilt = 10) {
  if (!cardElement) return () => {};

  const onMouseMove = (e) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    gsap.to(cardElement, {
      rotateX,
      rotateY,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
      transformStyle: "preserve-3d"
    });
  };

  const onMouseLeave = () => {
    gsap.to(cardElement, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.6)"
    });
  };

  cardElement.addEventListener("mousemove", onMouseMove);
  cardElement.addEventListener("mouseleave", onMouseLeave);

  return () => {
    cardElement.removeEventListener("mousemove", onMouseMove);
    cardElement.removeEventListener("mouseleave", onMouseLeave);
  };
}

export { gsap, ScrollTrigger };
