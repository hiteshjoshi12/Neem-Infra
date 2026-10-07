"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';



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
    <>
      <section
        ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#EFEBE1]
        text-[#17213D]
        py-16
        sm:py-20
        md:py-24
        border-t
        border-[#17213D]/[0.08]
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
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2.5">
            <span className="h-px w-8 bg-[#D09A16]" />

            <Sparkles
              size={12}
              strokeWidth={1.7}
              className="text-[#D09A16]"
            />

            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#182345]/70 sm:text-[10px]">
              {badge}
            </span>

            <span className="h-px w-8 bg-[#D09A16]" />
          </div>

          {/* Heading */}
          <h2
            id="services-heading"
            className="
              font-serif
              text-3xl
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
              font-normal
              leading-[1.08]
              tracking-tight
              text-[#182345]
            "
          >
            {titleMain}{' '}
            <span className="font-light italic text-[#D09A16]">
              {titleItalic}
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-[#566078] font-normal">
            {description}
          </p>

          {/* Decorative line */}
          <div
            ref={lineRef}
            className="mx-auto mt-6 h-px w-20 bg-[#D09A16]/60"
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

        </div>
      </div>
    </section>

    {/* Process: How We Work - Full Screen / Full Width Section (Light Shade) */}
    <HowWeWorkProcess />

    {/* DLF Gurugram Callout - Full Width Edge-to-Edge */}
    <DlfPropertyCallout />
  </>
);
}