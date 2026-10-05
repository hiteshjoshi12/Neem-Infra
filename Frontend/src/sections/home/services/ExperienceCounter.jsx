import { useEffect, useRef, useState } from 'react';
import {
  Award,
  ShieldCheck,
  Layers,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

import { animate, useInView, stagger } from 'framer-motion';
import { useCms } from '../../../context/CmsContext';


const DEFAULT_STATS_DATA = [
  {
    title: '100% Client Satisfaction',
    desc: 'Putting client interests first with bespoke, personalized property advisory.',
  },
  {
    title: 'DLF Micro-Market Leaders',
    desc: 'Unmatched expertise across DLF Phase 1–5, Sushant Lok, and Cybercity.',
  },
  {
    title: 'Verified Legal Titles',
    desc: 'Comprehensive due diligence ensuring safe and secure transactions.',
  },
  {
    title: 'Discreet & Ethical Advisory',
    desc: "Trusted by India's top corporate executives and high-net-worth families.",
  },
];

const STAT_ICONS = [
  ShieldCheck,
  Layers,
  CheckCircle2,
  TrendingUp,
];

export default function ExperienceCounter() {
  const { sections } = useCms();
  const expData = sections?.services?.experienceCounter || {};

  const target = Number(expData.yearsCount) || 25;

  const badge =
    expData.badge || `${target}+ Years of Unmatched Advisory`;

  const headline =
    expData.headline ||
    'Years of Experience as a Top Real Estate Consultant in DLF Gurugram';

  const description =
    expData.description ||
    'Our stellar team, trusted property dealers in Gurgaon and experts in commercial real estate in Gurugram, ensures you have a hassle-free experience finding the right property. We are committed to serving our clients with dedication, putting their needs above all else. Providing personalized solutions for all your property-related queries, we know that a satisfied customer is our greatest asset.';

  const statsList = expData.statsList || DEFAULT_STATS_DATA;

  const [count, setCount] = useState(1);

  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const contentRef = useRef(null);
  const statRefs = useRef([]);

  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (isInView) {
      animate(contentRef.current, { opacity: [0, 1], y: [25, 0] }, { duration: 0.8, ease: "easeOut" });
      
      animate(1, target, {
        duration: 1.6,
        ease: "easeOut",
        onUpdate: (latest) => setCount(Math.round(latest))
      });

      if (statRefs.current.length) {
        animate(statRefs.current, { opacity: [0, 1], y: [18, 0] }, { duration: 0.6, delay: stagger(0.1), ease: "easeOut" });
      }
    }
  }, [isInView, target]);

  return (
    <section
      ref={containerRef}
      aria-labelledby="experience-heading"
      className="relative my-14 md:my-18"
    >
      <div
        ref={contentRef}
        className="
          relative
          opacity-0
          overflow-hidden
          rounded-[26px]
          border
          border-[#182345]/10
          bg-white
          shadow-[0_20px_60px_-35px_rgba(24,35,69,0.3)]
        "
      >
        {/* =====================================================
            TOP GOLD LINE
        ====================================================== */}

        <div
          aria-hidden="true"
          className="
            absolute
            left-0
            right-0
            top-0
            h-[2px]
            bg-gradient-to-r
            from-transparent
            via-[#D09A16]
            to-transparent
          "
        />

        {/* =====================================================
            MAIN AUTHORITY AREA
        ====================================================== */}

        <div className="relative grid lg:grid-cols-[0.85fr_1.15fr]">

          {/* -----------------------------------------------
              COUNTER
          ------------------------------------------------ */}

          <div
            ref={counterRef}
            className="
              relative
              flex
              min-h-[260px]
              items-center
              justify-center
              overflow-hidden
              bg-[#182345]
              px-8
              py-10
              sm:px-12
              lg:min-h-[300px]
              lg:px-10
            "
          >
            {/* Architectural circles */}
            <div
              aria-hidden="true"
              className="
                absolute
                -right-20
                -top-20
                h-56
                w-56
                rounded-full
                border
                border-[#D09A16]/10
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute
                -right-8
                -top-8
                h-32
                w-32
                rounded-full
                border
                border-[#D09A16]/10
              "
            />

            <div className="relative text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <span className="h-px w-6 bg-[#D09A16]" />

                <Award
                  size={13}
                  strokeWidth={1.6}
                  className="text-[#D09A16]"
                />

                <span className="h-px w-6 bg-[#D09A16]" />
              </div>

              <div className="flex items-baseline justify-center">
                <span className="font-serif text-[82px] leading-none tracking-[-0.05em] text-white sm:text-[92px]">
                  {count}
                </span>

                <span className="ml-1 font-serif text-4xl text-[#D09A16] sm:text-5xl">
                  +
                </span>
              </div>

              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D09A16]">
                {expData.counterLabel || 'Years of Authority'}
              </p>

              <p className="mx-auto mt-2 max-w-[230px] text-[10px] leading-5 text-white/45">
                {expData.counterSublabel ||
                  "Serving India's Most Discerning Families & Corporates in Gurgaon"}
              </p>
            </div>
          </div>

          {/* -----------------------------------------------
              EDITORIAL CONTENT
          ------------------------------------------------ */}

          <div className="relative px-7 py-9 sm:px-10 sm:py-10 md:px-12">

            {/* Badge */}
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-6 bg-[#D09A16]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#182345]/55">
                {badge}
              </span>
            </div>

            <h3
              id="experience-heading"
              className="
                max-w-xl
                font-serif
                text-[26px]
                leading-[1.15]
                tracking-[-0.02em]
                text-[#182345]
                sm:text-[31px]
                md:text-[35px]
              "
            >
              {headline}
            </h3>

            <p className="mt-4 max-w-2xl text-[12px] leading-6 text-[#182345]/60 sm:text-sm">
              {description}
            </p>

            {/* Small authority indicator */}
            <div className="mt-6 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#182345]/45">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D09A16]" />
              Trusted Property Advisory
            </div>
          </div>
        </div>

        {/* =====================================================
            PROOF POINTS
        ====================================================== */}

        <div className="border-t border-[#182345]/10 bg-[#F9F7F4]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

            {statsList.map((item, idx) => {
              const IconComp =
                STAT_ICONS[idx % STAT_ICONS.length] || ShieldCheck;

              return (
                <article
                  key={idx}
                  ref={(el) => {
                    statRefs.current[idx] = el;
                  }}
                  className="
                    group
                    relative
                    opacity-0
                    border-b
                    border-[#182345]/10
                    px-6
                    py-6
                    transition-colors
                    duration-300
                    hover:bg-white
                    sm:nth-[odd]:border-r
                    lg:border-b-0
                    lg:border-r
                    lg:last:border-r-0
                  "
                >
                  <div className="flex items-start gap-3">

                    {/* Icon */}
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#D09A16]/25
                        bg-white
                        text-[#D09A16]
                        transition-all
                        duration-300
                        group-hover:border-[#D09A16]
                        group-hover:bg-[#D09A16]
                        group-hover:text-[#182345]
                      "
                    >
                      <IconComp size={14} strokeWidth={1.6} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-[11px] font-semibold leading-4 text-[#182345]">
                        {item.title}
                      </h4>

                      <p className="mt-1.5 text-[10px] leading-4 text-[#182345]/50">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* hover arrow */}
                  <ArrowUpRight
                    size={12}
                    className="
                      absolute
                      right-5
                      top-5
                      text-[#D09A16]/0
                      transition-all
                      duration-300
                      group-hover:text-[#D09A16]
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </article>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}