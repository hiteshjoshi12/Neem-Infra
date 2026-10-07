"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Brain,
} from "lucide-react";


/* =========================================================
   PRE-ENGINEERED AI QUERY
   ---------------------------------------------------------
   Keep this hidden from the UI.
   The same query is automatically passed to each AI engine.
========================================================= */

const PROMPT =
  "Search for Saudagar Properties in DLF Phase 2, Gurugram. Summarize their reputation in luxury real estate, their RERA compliance, and why they are top consultants for luxury builder floors and commercial properties.";

const encodedPrompt = encodeURIComponent(PROMPT);


/* =========================================================
   AI ENGINES
========================================================= */

const AI_ENGINES = [
  {
    id: "chatgpt",

    name: "ChatGPT",

    subtitle: "OpenAI",

    badge: "AI SEARCH",

    accent: "#10A37F",

    description:
      "Evaluate Saudagar Properties using OpenAI's conversational intelligence.",

    url: `https://chatgpt.com/?q=${encodedPrompt}`,

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
      >
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073z" />
      </svg>
    ),
  },

  {
    id: "perplexity",

    name: "Perplexity",

    subtitle: "Answer Engine",

    badge: "LIVE RESEARCH",

    accent: "#22B8CD",

    description:
      "Run a live research query across web sources and citations.",

    url: `https://www.perplexity.ai/search?q=${encodedPrompt}`,

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
      >
        <path d="M12 0L2.197 5.658v12.684L12 24l9.803-5.658V5.658L12 0zm7.625 17.067L12 21.464l-7.625-4.397V6.933L12 2.536l7.625 4.397v10.134z" />
        <path d="M12 4.417L4.767 8.59v8.343L12 21.106l7.233-4.173V8.59L12 4.417zm5.545 11.536L12 19.16l-5.545-3.207v-6.414L12 6.332l5.545 3.207v6.414z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },

  {
    id: "gemini",

    name: "Google Gemini",

    subtitle: "Google AI",

    badge: "AI DISCOVERY",

    accent: "#9D6CE5",

    description:
      "Explore Google's AI ecosystem with the same pre-engineered property query.",

    url: `https://gemini.google.com/app?q=${encodedPrompt}`,

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
      >
        <path d="M11.75 22.8c-.2 0-.4-.1-.5-.3l-2.5-6.6c-.1-.3-.4-.6-.7-.7l-6.6-2.5c-.2-.1-.3-.3-.3-.5s.1-.4.3-.5l6.6-2.5c.3-.1.6-.4.7-.7l2.5-6.6c.1-.2.3-.3.5-.3s.4.1.5.3l2.5 6.6c.1.3.4.6.7.7l6.6 2.5c.2.1.3.3.3.5s-.1.4-.3.5l-6.6 2.5c-.3.1-.6.4-.7.7l-2.5 6.6c-.1.2-.3.3-.5.3s-.4-.1-.5-.3z" />
      </svg>
    ),
  },
];


/* =========================================================
   AI CARD
========================================================= */

function AIEngineCard({ engine, index, cardRef }) {
  return (
    <a
      ref={cardRef}
      href={engine.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        relative
        block
        overflow-hidden
        rounded-[22px]
        border
        border-[#17213D]/10
        bg-white
        p-6
        shadow-[0_10px_35px_rgba(23,33,61,0.04)]
        transition-all
        duration-500
        hover:-translate-y-1.5
        hover:border-[#D09A16]/40
        hover:shadow-[0_20px_55px_rgba(23,33,61,0.09)]
      "
    >

      {/* =====================================================
          TOP GOLD LINE
      ===================================================== */}

      <div
        className="
          absolute
          left-6
          right-6
          top-0
          h-[2px]
          origin-left
          scale-x-0
          bg-[#D09A16]
          transition-transform
          duration-500
          group-hover:scale-x-100
        "
      />


      {/* =====================================================
          BACKGROUND NUMBER
      ===================================================== */}

      <span
        className="
          pointer-events-none
          absolute
          -right-1
          -top-5
          font-serif
          text-[90px]
          leading-none
          text-[#17213D]/[0.03]
          transition-colors
          duration-500
          group-hover:text-[#D09A16]/[0.08]
        "
      >
        0{index + 1}
      </span>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative z-10 flex items-start justify-between">

        {/* Icon */}

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-[#17213D]/10
            bg-[#F7F5EF]
            text-[#17213D]
            transition-all
            duration-500
            group-hover:scale-105
            group-hover:border-[#D09A16]
            group-hover:bg-[#D09A16]
            group-hover:text-[#0E162B]
          "
        >
          {engine.icon}
        </div>


        {/* Badge */}

        <span
          className="
            rounded-full
            border
            border-[#D09A16]/25
            bg-[#F7F5EF]
            px-2.5
            py-1
            text-[7px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#D09A16]
          "
        >
          {engine.badge}
        </span>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mt-6">

        <h3
          className="
            font-serif
            text-[24px]
            font-normal
            tracking-[-0.025em]
            text-[#17213D]
          "
        >
          {engine.name}
        </h3>


        <p
          className="
            mt-1
            text-[8px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-[#D09A16]
          "
        >
          {engine.subtitle}
        </p>


        <p
          className="
            mt-3.5
            min-h-[48px]
            text-xs
            leading-5
            text-[#566078]
          "
        >
          {engine.description}
        </p>

      </div>


      {/* =====================================================
          CTA
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mt-5
          flex
          items-center
          justify-between
          border-t
          border-[#17213D]/[0.08]
          pt-4
        "
      >

        <span
          className="
            text-[8px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#17213D]
            transition-colors
            group-hover:text-[#D09A16]
          "
        >
          Ask {engine.name}
        </span>


        <span
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-[#D09A16]/30
            text-[#D09A16]
            transition-all
            duration-300
            group-hover:border-[#D09A16]
            group-hover:bg-[#D09A16]
            group-hover:text-[#0E162B]
          "
        >
          <ArrowUpRight
            size={13}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-0.5
              group-hover:-translate-y-0.5
            "
          />
        </span>

      </div>

    </a>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AiShowcaseSection() {

  const sectionRef = useRef(null);

  const headerRef = useRef(null);

  const cardRefs = useRef([]);


  /* =====================================================
     SHORT ENTRANCE ANIMATION
  ===================================================== */

  useEffect(() => {

    const ctx = gsap.context(() => {

      const reduceMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;


      if (reduceMotion) return;


      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        }
      );


      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        {
          opacity: 0,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          delay: 0.12,
          ease: "power3.out",
        }
      );

    }, sectionRef);


    return () => ctx.revert();

  }, []);


  return (

    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        border-t
        border-[#17213D]/[0.08]
        bg-[#F7F5EF]
        py-16
        sm:py-20
        lg:py-24
      "
    >

      {/* =====================================================
          SUBTLE BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-[-180px]
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#D09A16]/[0.04]
          blur-[100px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.018]
          [background-image:linear-gradient(to_right,#17213D_1px,transparent_1px),linear-gradient(to_bottom,#17213D_1px,transparent_1px)]
          [background-size:100px_100px]
        "
      />


      {/* =====================================================
          NARROW CONTENT CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-5xl
          px-5
          sm:px-7
          lg:px-8
        "
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          ref={headerRef}
          className="
            mx-auto
            mb-10
            max-w-2xl
            text-center
          "
        >

          {/* Badge */}

          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#D09A16]/30
              bg-white
              px-3.5
              py-1.5
              text-[8px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#D09A16]
              shadow-sm
            "
          >

            <Sparkles
              size={11}
              className="text-[#D09A16]"
            />

            AI Authority Check

          </div>


          {/* Heading */}

          <h2
            className="
              font-serif
              text-4xl
              font-normal
              leading-[1.05]
              tracking-[-0.04em]
              text-[#17213D]
              sm:text-5xl
            "
          >

            See how AI
            <span
              className="
                ml-2
                italic
                font-light
                text-[#D09A16]
              "
            >
              sees us.
            </span>

          </h2>


          {/* Description */}

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-xs
              leading-6
              text-[#566078]
              sm:text-sm
            "
          >
            Explore Saudagar Properties through the world&apos;s leading
            AI answer engines using our pre-engineered research query.
          </p>


          {/* Trust line */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-3
            "
          >

            <span
              className="
                h-px
                w-8
                bg-[#D09A16]/40
              "
            />

            <span
              className="
                text-[7px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#17213D]/40
              "
            >
              RERA · REPUTATION · LOCAL AUTHORITY
            </span>

            <span
              className="
                h-px
                w-8
                bg-[#D09A16]/40
              "
            />

          </div>

        </div>


        {/* ===================================================
            AI CARDS
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-3
          "
        >

          {AI_ENGINES.map(
            (engine, index) => (

              <AIEngineCard
                key={engine.id}
                engine={engine}
                index={index}
                cardRef={(el) => {
                  cardRefs.current[index] = el;
                }}
              />

            )
          )}

        </div>


        {/* ===================================================
            SMALL FOOTER
        =================================================== */}

        <div
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-2
          "
        >

          <ShieldCheck
            size={13}
            className="text-[#D09A16]"
          />

          <span
            className="
              text-[8px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#17213D]/40
            "
          >
            One verified query · Three independent AI engines
          </span>

        </div>

      </div>

    </section>

  );
}