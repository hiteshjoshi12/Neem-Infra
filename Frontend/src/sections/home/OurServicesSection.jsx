import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

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

import ServicesCardsGrid from './services/ServicesCardsGrid';
import ExperienceCounter from './services/ExperienceCounter';
import HowWeWorkProcess from './services/HowWeWorkProcess';
import DlfPropertyCallout from './services/DlfPropertyCallout';
import { useCms } from '../../context/CmsContext';


export default function OurServicesSection() {
  const { sections } = useCms();
  const data = sections?.services || {};

  const badge = data.badge || 'Bespoke Property Solutions';
  const titleMain = data.titleMain || 'Our';
  const titleItalic = data.titleItalic || 'Services';

  const description =
    data.description ||
    'As the top real estate consultant in DLF Gurugram, let’s explore where our expertise lies and how it translates into real value for you.';

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        lineRef.current,
        {
          scaleX: 0,
          transformOrigin: 'center',
        },
        {
          scaleX: 1,
          duration: 0.8,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#F9F7F4]
        text-[#182345]
        py-14
        sm:py-16
        md:py-20
      "
    >
      {/* =====================================================
          SUBTLE ARCHITECTURAL BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* very subtle radial texture */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.012]
            bg-[radial-gradient(#182345_1px,transparent_1px)]
            [background-size:40px_40px]
          "
        />

        {/* soft gold ambient light */}
        <div
          className="
            absolute
            -right-40
            top-[20%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#D09A16]/[0.035]
            blur-[110px]
          "
        />

        <div
          className="
            absolute
            -left-40
            bottom-[15%]
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#182345]/[0.025]
            blur-[100px]
          "
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            SECTION INTRO
        ====================================================== */}

        <header
          ref={headerRef}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-14"
        >
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-px w-7 bg-[#D09A16]" />

            <Sparkles
              size={12}
              strokeWidth={1.7}
              className="text-[#D09A16]"
            />

            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#182345]/60">
              {badge}
            </span>

            <span className="h-px w-7 bg-[#D09A16]" />
          </div>

          {/* Heading */}
          <h2
            id="services-heading"
            className="
              font-serif
              text-[32px]
              leading-[1.1]
              tracking-[-0.02em]
              text-[#182345]
              sm:text-[38px]
              md:text-[44px]
            "
          >
            {titleMain}{' '}
            <span className="font-light italic text-[#D09A16]">
              {titleItalic}
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-6 text-[#182345]/60 sm:text-sm">
            {description}
          </p>

          {/* Decorative line */}
          <div
            ref={lineRef}
            className="mx-auto mt-6 h-px w-16 bg-[#D09A16]/50"
          />
        </header>

        {/* =====================================================
            SERVICES
        ====================================================== */}

        <div className="space-y-12 md:space-y-16">

          {/* Core Services */}
          <div>
            <ServicesCardsGrid />
          </div>

          {/* Experience */}
          <div>
            <ExperienceCounter />
          </div>

          {/* Process */}
          <div>
            <HowWeWorkProcess />
          </div>

          {/* DLF Callout */}
          <div>
            <DlfPropertyCallout />
          </div>

        </div>
      </div>
    </section>
  );
}