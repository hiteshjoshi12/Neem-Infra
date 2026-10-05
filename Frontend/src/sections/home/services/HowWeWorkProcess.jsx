import { useEffect, useMemo, useRef, useState } from "react";
import {
  Compass,
  Users,
  Key,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { gsap } from "gsap";
import { useCms } from "../../../context/CmsContext";


/* =========================================================
   DEFAULT CONTENT
========================================================= */

const DEFAULT_PROCESS_STEPS = [
  {
    step: "01",
    phaseTag: "Discovery & Alignment",
    title: "Understanding your Purpose",
    badge: "Client Purpose & Portfolio Needs",
    icon: Compass,

    imageText:
      "At Saudagar Properties, your trusted top real estate consultant in DLF Gurugram, we serve as a reliable platform to buy, rent, sell, or lease residential, commercial, and industrial properties. Whether you're looking for a flat, villa, or kothi in Gurgaon or DLF Phase 2, or office space in Udyog Vihar, we are your one-stop solution to meet all your property needs within your budget and convenience.",

    chatText:
      "Saudagar Properties is an efficient online portal that helps you to buy, rent, sell, resale, or lease residential, commercial, and industrial properties. We are the most sorted and preferred real estate portal in India which is here to serve all your property needs. Whether you need an apartment, a villa, a kothi, a building, an office space, etc, we are the one-stop platform to fulfill all your needs within your budget and convenience.",
  },

  {
    step: "02",
    phaseTag: "Strategic Advisory",
    title: "Planning with our experts",
    badge: "Direct Consultation & Zero Middlemen",
    icon: Users,

    imageText:
      "Our dedicated team of professionals provides personalized guidance, answering all your queries and helping you avoid the hassle of middlemen like brokers and financers. We assist you in selecting the perfect property whether residential or commercial and handle the formalities efficiently, ensuring you stay within your budget.",

    chatText:
      "We have a team of professionals who offer you all solutions relating to your property needs and clear all your doubts and queries. By removing the need to hire brokers, financers, and other middlemen, we make it easy for you to choose a relevant project for your residential or commercial purposes, get done with the formalities, and complete the whole process while sticking to your budget.",
  },

  {
    step: "03",
    phaseTag: "Execution & Handover",
    title: "Implementation as per plan",
    badge: "Smooth Coordination & Turnkey Delivery",
    icon: Key,

    imageText:
      "Once your needs are clear, our experts actively search for the best property options tailored to you. We pride ourselves on dedication and transparency, ensuring smooth coordination and keeping you informed throughout the process. Reach out to us today, and let's discuss how we can help you find your ideal property in DLF Gurugram.",

    chatText:
      "Our experts start looking for the best property options suitable as per your needs. We are deeply committed to serving our customers with the best. We inspire others with our dedication and passion to ensure complete customer satisfaction and quality in our services. So, we make sure to go ahead with a smooth coordination and keep our customers informed. Let’s discuss over a call on how we can serve you!",
  },
];


/* =========================================================
   ARCHITECTURAL VISUAL
========================================================= */
function ArchitecturalVisual({ type }) {

  /* =====================================================
     01 — DISCOVERY / FLOOR PLAN
  ===================================================== */

  if (type === 0) {
    return (
      <div className="relative h-full w-full">

        {/* Glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-36
            w-36
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#D09A16]/10
            blur-3xl
            transition-all
            duration-700
            group-hover:h-48
            group-hover:w-48
          "
        />


        {/* Floor plan */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-32
            w-44
            -translate-x-1/2
            -translate-y-1/2
            rotate-[-12deg]
            [transform:perspective(800px)_rotateX(55deg)_rotateZ(-12deg)]
            transition-all
            duration-700
            group-hover:-translate-y-2
            group-hover:scale-105
          "
        >

          <div
            className="
              absolute
              inset-0
              border
              border-[#D09A16]/60
            "
          />

          <div
            className="
              absolute
              inset-4
              border
              border-[#182345]/15
            "
          />

          <div
            className="
              absolute
              left-4
              top-4
              h-10
              w-12
              border
              border-[#D09A16]/40
            "
          />

          <div
            className="
              absolute
              right-4
              top-4
              h-10
              w-12
              border
              border-[#D09A16]/40
            "
          />

          <div
            className="
              absolute
              bottom-4
              left-4
              h-8
              w-24
              border
              border-[#182345]/15
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-3
              w-3
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#D09A16]
              shadow-[0_0_20px_rgba(208,154,22,0.55)]
            "
          />

        </div>


        {/* Label */}

        <div
          className="
            absolute
            bottom-3
            left-1/2
            -translate-x-1/2
            whitespace-nowrap
            text-[6px]
            font-bold
            uppercase
            tracking-[0.3em]
            text-[#182345]/25
          "
        >
          DISCOVERY / 01
        </div>

      </div>
    );
  }


  /* =====================================================
     02 — ADVISORY / CUBE
  ===================================================== */

  if (type === 1) {
    return (
      <div className="relative h-full w-full">

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-36
            w-36
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#D09A16]/10
            blur-3xl
          "
        />


        {/* Cube */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-24
            w-24
            -translate-x-1/2
            -translate-y-1/2
            [transform-style:preserve-3d]
            [transform:perspective(800px)_rotateX(-20deg)_rotateY(30deg)]
            transition-all
            duration-700
            group-hover:[transform:perspective(800px)_rotateX(-14deg)_rotateY(42deg)_translateY(-10px)]
          "
        >

          <div
            className="
              absolute
              inset-0
              border
              border-[#D09A16]/55
              bg-[#D09A16]/[0.015]
              [transform:translateZ(48px)]
            "
          />

          <div
            className="
              absolute
              inset-0
              border
              border-[#D09A16]/40
              bg-[#D09A16]/[0.01]
              [transform:rotateY(90deg)_translateZ(48px)]
            "
          />

          <div
            className="
              absolute
              inset-0
              border
              border-[#182345]/15
              [transform:rotateX(90deg)_translateZ(48px)]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-2
              w-2
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#D09A16]
              shadow-[0_0_20px_rgba(208,154,22,0.55)]
              [transform:translateZ(52px)]
            "
          />

        </div>


        {/* Orbit */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-20
            w-56
            -translate-x-1/2
            -translate-y-1/2
            rotate-[-20deg]
            rounded-[50%]
            border
            border-[#D09A16]/20
            transition-transform
            duration-700
            group-hover:rotate-[-30deg]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-20
            w-56
            -translate-x-1/2
            -translate-y-1/2
            rotate-[20deg]
            rounded-[50%]
            border
            border-[#182345]/10
            transition-transform
            duration-700
            group-hover:rotate-[30deg]
          "
        />


        <div
          className="
            absolute
            bottom-3
            left-1/2
            -translate-x-1/2
            whitespace-nowrap
            text-[6px]
            font-bold
            uppercase
            tracking-[0.3em]
            text-[#182345]/25
          "
        >
          ADVISORY / 02
        </div>

      </div>
    );
  }


  /* =====================================================
     03 — EXECUTION / TOWER
  ===================================================== */

  return (
    <div className="relative h-full w-full">

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-40
          w-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#D09A16]/10
          blur-3xl
        "
      />


      {/* Back building */}

      <div
        className="
          absolute
          bottom-7
          left-1/2
          h-36
          w-12
          -translate-x-[70%]
          border
          border-[#182345]/10
          bg-white/60
          transition-transform
          duration-700
          group-hover:-translate-x-[85%]
        "
      />


      {/* Main tower */}

      <div
        className="
          absolute
          bottom-7
          left-1/2
          h-44
          w-[72px]
          -translate-x-1/2
          skew-y-[-3deg]
          border
          border-[#182345]/20
          bg-gradient-to-r
          from-white
          via-[#F5F0E5]
          to-white
          shadow-[12px_12px_35px_rgba(24,35,69,0.08)]
          transition-all
          duration-700
          group-hover:-translate-x-1/2
          group-hover:-translate-y-2
        "
      >

        <div
          className="
            grid
            h-full
            grid-cols-2
            gap-2
            p-3
          "
        >

          {Array.from({ length: 12 }).map(
            (_, index) => (
              <span
                key={index}
                className="
                  border
                  border-[#D09A16]/25
                  bg-[#D09A16]/[0.035]
                  transition-colors
                  duration-300
                  group-hover:bg-[#D09A16]/10
                "
              />
            )
          )}

        </div>

      </div>


      {/* Gold vertical line */}

      <div
        className="
          absolute
          bottom-7
          left-1/2
          h-52
          w-px
          -translate-x-1/2
          bg-gradient-to-t
          from-[#D09A16]
          via-[#D09A16]/40
          to-transparent
          opacity-70
        "
      />


      <div
        className="
          absolute
          bottom-3
          left-1/2
          -translate-x-1/2
          whitespace-nowrap
          text-[6px]
          font-bold
          uppercase
          tracking-[0.3em]
          text-[#182345]/25
        "
      >
        DELIVERY / 03
      </div>

    </div>
  );
}


/* =========================================================
   PROCESS CARD
========================================================= */

function ProcessCard({
  step,
  index,
  expanded,
  onToggle,
}) {
  const Icon = step.icon || Compass;

  return (
    <article
      className={`
        group relative overflow-hidden
        rounded-[28px]
        border
        border-[#182345]/10
        bg-[#FFFFFF]
        shadow-[0_18px_60px_rgba(24,35,69,0.055)]
        transition-all duration-500
        hover:-translate-y-2
        hover:border-[#D09A16]/35
        hover:shadow-[0_28px_90px_rgba(24,35,69,0.11)]
        ${expanded ? "border-[#D09A16]/35 shadow-[0_28px_90px_rgba(24,35,69,0.11)]" : ""}
      `}
    >

      {/* =====================================================
          BACKGROUND NUMBER
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-3
          -top-5
          z-0
          select-none
          font-serif
          text-[150px]
          font-normal
          leading-none
          text-[#182345]/[0.035]
          transition-all
          duration-700
          group-hover:text-[#D09A16]/[0.075]
          group-hover:-translate-y-1
        "
      >
        {step.step}
      </div>


      {/* =====================================================
          GOLD TOP ACCENT
      ===================================================== */}

      <div
        className="
          absolute
          left-8
          top-0
          z-20
          h-[2px]
          w-12
          bg-[#D09A16]
          transition-all
          duration-500
          group-hover:w-24
        "
      />


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          px-7
          pt-6
        "
      >

        {/* Step */}

        <div
          className="
            flex
            items-center
            gap-2
            font-serif
            text-sm
            text-[#182345]
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-[#D09A16]
              shadow-[0_0_0_4px_rgba(208,154,22,0.08)]
            "
          />

          {step.step}
        </div>


        {/* Phase */}

        <span
          className="
            max-w-[65%]
            text-right
            text-[7px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#A87505]
          "
        >
          {step.phaseTag}
        </span>

      </div>


      {/* =====================================================
          ARCHITECTURAL VISUAL
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mt-3
          h-[235px]
          overflow-hidden
          bg-gradient-to-br
          from-[#F9F7F4]
          via-[#F7F3EB]
          to-[#F9F7F4]
        "
      >

        {/* subtle grid */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(to_right,#182345_1px,transparent_1px),linear-gradient(to_bottom,#182345_1px,transparent_1px)]
            [background-size:45px_45px]
          "
        />

        <ArchitecturalVisual
          type={index}
        />

      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          px-7
          pb-5
          pt-6
        "
      >

        {/* Icon */}

        <div
          className="
            mb-4
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-[#D09A16]/25
            bg-[#D09A16]/[0.055]
            text-[#D09A16]
            transition-all
            duration-500
            group-hover:-translate-y-1
            group-hover:bg-[#D09A16]
            group-hover:text-white
          "
        >
          <Icon
            size={18}
            strokeWidth={1.5}
          />
        </div>


        {/* Title */}

        <h3
          className="
            max-w-[95%]
            font-serif
            text-[29px]
            font-normal
            leading-[1.08]
            tracking-[-0.025em]
            text-[#182345]
            sm:text-[31px]
          "
        >
          {step.title}
        </h3>


        {/* =================================================
            PREVIEW
        ================================================= */}

        <div
          className={`
            mt-4
            overflow-hidden
            transition-all
            duration-500
            ${expanded
              ? "max-h-[500px]"
              : "max-h-[86px]"
            }
          `}
        >

          <p
            className="
              text-[12px]
              leading-[1.8]
              text-[#5D667D]
            "
          >
            {step.imageText}
          </p>

        </div>


        {/* =================================================
            EXPANDED INFORMATION
        ================================================= */}

        <div
          className={`
            grid
            transition-all
            duration-500
            ${expanded
              ? "mt-6 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
            }
          `}
        >

          <div className="overflow-hidden">

            {/* divider */}

            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  h-px
                  w-8
                  bg-[#D09A16]/50
                "
              />

              <span
                className="
                  whitespace-nowrap
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#D09A16]
                "
              >
                Client Advisory
              </span>

              <span
                className="
                  h-px
                  flex-1
                  bg-[#182345]/10
                "
              />

            </div>


            {/* badge */}

            <div
              className="
                rounded-2xl
                border
                border-[#182345]/[0.07]
                bg-[#F9F7F4]
                p-4
              "
            >

              <span
                className="
                  mb-2
                  block
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#182345]
                "
              >
                {step.badge}
              </span>


              <p
                className="
                  text-[10px]
                  leading-[1.75]
                  text-[#5D667D]
                "
              >
                {step.chatText}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTION
        ================================================= */}

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-between
            border-t
            border-[#182345]/[0.08]
            pt-4
            text-left
            text-[8px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#182345]
          "
        >

          <span>
            {expanded
              ? "Hide details"
              : "Explore this stage"}
          </span>


          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[#D09A16]/30
              text-[#D09A16]
              transition-all
              duration-500
              group-hover:border-[#D09A16]
              group-hover:bg-[#D09A16]
              group-hover:text-white
            "
          >

            <ArrowUpRight
              size={14}
              className={`
                transition-transform
                duration-500
                ${expanded ? "rotate-90" : ""}
              `}
            />

          </span>

        </button>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            border-t
            border-[#182345]/[0.05]
            pt-4
            text-[6px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-[#182345]/25
          "
        >

          <span>
            SAUDAGAR PROPERTIES
          </span>

          <span
            className="
              h-px
              w-7
              bg-[#D09A16]/25
            "
          />

          <span>
            {step.step} / 03
          </span>

        </div>

      </div>

    </article>
  );
}



/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HowWeWorkProcess() {
  const { sections } = useCms();

  const howData =
    sections?.services?.howWeWork || {};

  const badge =
    howData.badge ||
    "Private Property Advisory";

  const titleMain =
    howData.titleMain ||
    "How Do We";

  const titleItalic =
    howData.titleItalic ||
    "Work?";

  const description =
    howData.description ||
    "Experience our seamless, three-stage property advisory tailored for discerning buyers, investors, and corporate leaders across DLF Gurugram.";

  const steps = useMemo(() => {
    const rawSteps = howData.steps;

    if (
      !rawSteps ||
      !Array.isArray(rawSteps) ||
      rawSteps.length === 0
    ) {
      return DEFAULT_PROCESS_STEPS;
    }

    return DEFAULT_PROCESS_STEPS.map(
      (defaultStep, index) => ({
        ...defaultStep,
        ...(rawSteps[index] || {}),
      })
    );
  }, [howData.steps]);


  const sectionRef = useRef(null);

  const [expandedIndex, setExpandedIndex] =
    useState(null);


  /* =====================================================
     SIMPLE ENTRANCE ANIMATION
     NO SCROLLTRIGGER
  ===================================================== */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      if (reduceMotion) {
        gsap.set(
          [
            ".process-header > *",
            ".premium-process-card",
          ],
          {
            opacity: 1,
            y: 0,
          }
        );

        return;
      }

      gsap.fromTo(
        ".process-header > *",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".premium-process-card",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.15,
          ease: "power3.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [steps]);


  /* =====================================================
     CARD TOGGLE
  ===================================================== */

  const handleToggle = (index) => {
    setExpandedIndex(
      expandedIndex === index
        ? null
        : index
    );
  };


  return (
    <section
      ref={sectionRef}
      className="how-we-work relative overflow-hidden bg-[#F9F7F4] px-4 py-8 sm:px-8 lg:px-6 lg:py-12">

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-200px]
          h-[650px]
          w-[850px]
          -translate-x-1/2
          rounded-full
          bg-[#D09A16]/[0.045]
          blur-[120px]
        "
      />


      {/* subtle architectural grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
        "
        aria-hidden="true"
      >

        <div className="absolute left-[20%] top-0 h-full w-px bg-[#182345]" />
        <div className="absolute left-[40%] top-0 h-full w-px bg-[#182345]" />
        <div className="absolute left-[60%] top-0 h-full w-px bg-[#182345]" />
        <div className="absolute left-[80%] top-0 h-full w-px bg-[#182345]" />

      </div>


      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          process-header
          relative
          z-10
          mx-auto
          mb-16
          max-w-4xl
          text-center
          lg:mb-20
        "
      >

        <div
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-[#D09A16]/25
            bg-[#D09A16]/[0.055]
            px-4
            py-2
            text-[9px]
            font-bold
            uppercase
            tracking-[0.25em]
            text-[#A87505]
          "
        >

          <Sparkles size={12} />

          {badge}

        </div>


        <div className="mb-5 flex items-center justify-center gap-3">

          <span className="h-px w-10 bg-[#D09A16]/50" />

          <span className="h-1.5 w-1.5 rounded-full bg-[#D09A16]" />

          <span className="h-px w-10 bg-[#D09A16]/50" />

        </div>


        <h2
          className="
            font-serif
            text-5xl
            font-normal
            leading-none
            tracking-[-0.045em]
            text-[#182345]
            sm:text-6xl
            lg:text-7xl
          "
        >

          {titleMain}{" "}

          <span
            className="
              italic
              font-light
              text-[#D09A16]
            "
          >
            {titleItalic}
          </span>

        </h2>


        <p
          className="
            mx-auto
            mt-7
            max-w-2xl
            text-sm
            leading-7
            text-[#5D667D]
            sm:text-base
          "
        >
          {description}
        </p>


        <div
          className="
            mt-7
            flex
            items-center
            justify-center
            gap-3
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.28em]
            text-[#182345]/35
          "
        >

          <span>CURATED</span>

          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

          <span>CONSIDERED</span>

          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

          <span>PRIVATE</span>

        </div>

      </header>


      {/* =================================================
          PROCESS
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
        "
      >

        {/* horizontal connecting line */}

        <div
          className="
            pointer-events-none
            absolute
            left-[16.5%]
            right-[16.5%]
            top-[28px]
            hidden
            h-px
            lg:block
          "
        >

          <div className="h-full bg-[#182345]/10" />

          <div
            className="
              absolute
              inset-y-0
              left-0
              w-full
              bg-gradient-to-r
              from-[#D09A16]/20
              via-[#D09A16]
              to-[#D09A16]/20
            "
          />

        </div>


        {/* cards */}

        <div
          className="
            grid
            grid-cols-1
            gap-7
            lg:grid-cols-3
            lg:gap-6
          "
        >

          {steps.map((step, index) => (
            <ProcessCard
              key={step.step}
              step={step}
              index={index}
              expanded={expandedIndex === index}
              onToggle={() =>
                handleToggle(index)
              }
            />
          ))}

        </div>

      </div>


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* =================================================
           CARD
        ================================================= */

        .premium-process-card {
          position: relative;
          min-height: 650px;
          overflow: hidden;

          border:
            1px solid
            rgba(24,35,69,0.10);

          border-radius: 28px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.96),
              rgba(255,255,255,0.78)
            );

          box-shadow:
            0 18px 60px
            rgba(24,35,69,0.055);

          transition:
            min-height 0.7s cubic-bezier(.2,.8,.2,1),
            transform 0.5s cubic-bezier(.2,.8,.2,1),
            box-shadow 0.5s ease,
            border-color 0.5s ease;

          isolation: isolate;
        }


        .premium-process-card:hover,
        .premium-process-card.is-expanded {
          transform: translateY(-7px);

          border-color:
            rgba(208,154,22,0.32);

          box-shadow:
            0 28px 90px
            rgba(24,35,69,0.11);
        }


        /* =================================================
           LARGE NUMBER
        ================================================= */

        .card-number {
          position: absolute;

          right: -10px;
          top: -15px;

          z-index: -1;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 165px;
          font-weight: 400;

          line-height: 1;

          color:
            rgba(24,35,69,0.035);

          transition:
            color 0.6s ease,
            transform 0.7s ease;
        }


        .premium-process-card:hover .card-number,
        .premium-process-card.is-expanded .card-number {
          color:
            rgba(208,154,22,0.075);

          transform:
            translateY(-5px);
        }


        /* =================================================
           GOLD TOP LINE
        ================================================= */

        .card-gold-line {
          position: absolute;

          left: 35px;
          top: 0;

          width: 50px;
          height: 2px;

          background:
            #D09A16;

          transition:
            width 0.6s
            cubic-bezier(.2,.8,.2,1);
        }


        .premium-process-card:hover .card-gold-line,
        .premium-process-card.is-expanded .card-gold-line {
          width: 100px;
        }


        /* =================================================
           HEADER
        ================================================= */

        .card-header {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding:
            20px 28px 0;
        }


        .card-step {
          display: flex;
          align-items: center;
          gap: 8px;

          color:
            #182345;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 14px;
        }


        .card-step-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background:
            #D09A16;

          box-shadow:
            0 0 0 4px
            rgba(208,154,22,0.08);
        }


        .card-phase {
          max-width: 60%;

          text-align: right;

          color:
            #A87505;

          font-size: 7px;
          font-weight: 700;

          letter-spacing:
            0.18em;

          text-transform:
            uppercase;
        }


        /* =================================================
           VISUAL
        ================================================= */

        .card-visual {
          position: relative;

          height: 245px;

          margin-top: 12px;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #F9F7F4,
              #F4F0E8
            );
        }


        /* =================================================
           MAIN CONTENT
        ================================================= */

        .card-main {
          position: relative;
          z-index: 3;

          padding:
            22px 28px 0;
        }


        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 42px;
          height: 42px;

          margin-bottom: 14px;

          border:
            1px solid
            rgba(208,154,22,0.25);

          border-radius: 50%;

          color:
            #D09A16;

          background:
            rgba(208,154,22,0.045);

          transition:
            background 0.4s ease,
            color 0.4s ease,
            transform 0.4s ease;
        }


        .premium-process-card:hover .card-icon,
        .premium-process-card.is-expanded .card-icon {
          color: white;

          background:
            #D09A16;

          transform:
            translateY(-2px);
        }


        .card-main h3 {
          margin: 0;

          max-width: 90%;

          color:
            #182345;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 29px;
          font-weight: 400;

          line-height: 1.08;

          letter-spacing:
            -0.025em;
        }


        .card-short-description {
          margin-top: 13px;

          max-height: 48px;

          overflow: hidden;

          position: relative;
        }


        .card-short-description::after {
          content: "";

          position: absolute;

          bottom: 0;
          left: 0;
          right: 0;

          height: 25px;

          background:
            linear-gradient(
              to bottom,
              rgba(255,255,255,0),
              rgba(255,255,255,0.95)
            );
        }


        .card-short-description p {
          margin: 0;

          color:
            #5D667D;

          font-size: 11px;

          line-height: 1.75;
        }


        /* =================================================
           DETAILS
        ================================================= */

        .card-details {
          position: relative;
          z-index: 3;

          max-height: 0;

          overflow: hidden;

          padding:
            0 28px;

          opacity: 0;

          transform:
            translateY(10px);

          transition:
            max-height 0.75s
              cubic-bezier(.2,.8,.2,1),
            opacity 0.45s ease,
            transform 0.6s
              cubic-bezier(.2,.8,.2,1),
            padding 0.7s ease;
        }


        .card-details.visible {
          max-height: 330px;

          padding:
            22px 28px 0;

          opacity: 1;

          transform:
            translateY(0);
        }


        .detail-divider {
          display: flex;
          align-items: center;

          gap: 8px;

          margin-bottom: 15px;
        }


        .detail-divider span {
          height: 1px;

          width: 25px;

          background:
            rgba(208,154,22,0.45);
        }


        .detail-divider small {
          color:
            #D09A16;

          font-size: 7px;
          font-weight: 700;

          letter-spacing:
            0.18em;

          white-space:
            nowrap;
        }


        .detail-block {
          padding:
            14px 16px;

          border:
            1px solid
            rgba(24,35,69,0.07);

          border-radius:
            14px;

          background:
            rgba(249,247,244,0.7);
        }


        .detail-label {
          display: block;

          margin-bottom: 8px;

          color:
            #182345;

          font-size: 7px;
          font-weight: 700;

          letter-spacing:
            0.15em;

          text-transform:
            uppercase;
        }


        .detail-block p {
          margin: 0;

          color:
            #5D667D;

          font-size: 10px;

          line-height: 1.7;
        }


        /* =================================================
           ACTION
        ================================================= */

        .card-action {
          position: absolute;

          left: 28px;
          right: 28px;

          bottom: 48px;

          z-index: 10;

          display: flex;
          align-items: center;
          justify-content: space-between;

          width: calc(100% - 56px);

          padding:
            11px 0;

          border: 0;

          border-top:
            1px solid
            rgba(24,35,69,0.08);

          background:
            transparent;

          color:
            #182345;

          cursor:
            pointer;

          font-size: 8px;
          font-weight: 700;

          letter-spacing:
            0.16em;

          text-align:
            left;

          text-transform:
            uppercase;
        }


        .action-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 27px;
          height: 27px;

          border:
            1px solid
            rgba(208,154,22,0.25);

          border-radius: 50%;

          color:
            #D09A16;

          transition:
            background 0.35s ease,
            color 0.35s ease,
            transform 0.4s ease;
        }


        .premium-process-card:hover .action-icon,
        .premium-process-card.is-expanded .action-icon {
          color:
            white;

          background:
            #D09A16;

          transform:
            rotate(45deg);
        }


        /* =================================================
           FOOTER
        ================================================= */

        .card-footer {
          position: absolute;

          bottom: 17px;

          left: 28px;
          right: 28px;

          display: flex;
          align-items: center;
          gap: 8px;

          color:
            rgba(24,35,69,0.25);

          font-size: 6px;
          font-weight: 700;

          letter-spacing:
            0.2em;
        }


        .footer-line {
          width: 25px;

          height: 1px;

          background:
            rgba(208,154,22,0.25);
        }


        /* =================================================
           ARCHITECTURAL VISUAL
        ================================================= */

        .property-visual {
          position: relative;

          width: 100%;
          height: 245px;

          perspective:
            900px;
        }


        .visual-glow {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 150px;
          height: 150px;

          transform:
            translate(-50%, -50%);

          border-radius:
            50%;

          background:
            rgba(208,154,22,0.08);

          filter:
            blur(40px);

          transition:
            width 0.7s ease,
            height 0.7s ease,
            opacity 0.7s ease;
        }


        .premium-process-card:hover
        .visual-glow,
        .premium-process-card.is-expanded
        .visual-glow {
          width: 200px;
          height: 200px;

          background:
            rgba(208,154,22,0.13);
        }


        .visual-corner-label {
          position: absolute;

          bottom: 13px;
          left: 50%;

          transform:
            translateX(-50%);

          color:
            rgba(24,35,69,0.28);

          font-size: 6px;
          font-weight: 700;

          letter-spacing:
            0.3em;

          white-space:
            nowrap;
        }


        /* =================================================
           FLOOR PLAN
        ================================================= */

        .floor-plan {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 170px;
          height: 125px;

          transform:
            translate(-50%, -50%)
            rotateX(55deg)
            rotateZ(-15deg);

          transform-style:
            preserve-3d;

          transition:
            transform 0.9s
            cubic-bezier(.2,.8,.2,1);
        }


        .premium-process-card:hover
        .floor-plan,
        .premium-process-card.is-expanded
        .floor-plan {
          transform:
            translate(-50%, -50%)
            rotateX(55deg)
            rotateZ(-9deg)
            translateY(-10px)
            scale(1.06);
        }


        .floor-outer,
        .floor-inner,
        .floor-room,
        .floor-center {
          position: absolute;

          border:
            1px solid
            rgba(208,154,22,0.55);
        }


        .floor-outer {
          inset: 0;
        }


        .floor-inner {
          inset: 15px;

          border-color:
            rgba(24,35,69,0.17);
        }


        .room-one {
          left: 15px;
          top: 15px;

          width: 50px;
          height: 38px;
        }


        .room-two {
          right: 15px;
          top: 15px;

          width: 50px;
          height: 38px;
        }


        .room-three {
          left: 15px;
          bottom: 15px;

          width: 90px;
          height: 30px;
        }


        .floor-center {
          left: 50%;
          top: 50%;

          width: 10px;
          height: 10px;

          transform:
            translate(-50%, -50%);

          border-radius:
            50%;

          background:
            #D09A16;

          box-shadow:
            0 0 20px
            rgba(208,154,22,0.5);
        }


        /* =================================================
           CUBE
        ================================================= */

        .cube-scene {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 90px;
          height: 90px;

          transform:
            translate(-50%, -50%)
            rotateX(-20deg)
            rotateY(30deg);

          transform-style:
            preserve-3d;

          transition:
            transform 0.9s
            cubic-bezier(.2,.8,.2,1);
        }


        .premium-process-card:hover
        .cube-scene,
        .premium-process-card.is-expanded
        .cube-scene {
          transform:
            translate(-50%, -50%)
            rotateX(-14deg)
            rotateY(42deg)
            translateY(-10px);
        }


        .cube-face {
          position: absolute;

          inset: 0;

          border:
            1px solid
            rgba(208,154,22,0.55);

          background:
            rgba(208,154,22,0.02);
        }


        .cube-front {
          transform:
            translateZ(45px);
        }


        .cube-right {
          transform:
            rotateY(90deg)
            translateZ(45px);
        }


        .cube-top {
          transform:
            rotateX(90deg)
            translateZ(45px);
        }


        .cube-center {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 8px;
          height: 8px;

          transform:
            translate(-50%, -50%)
            translateZ(50px);

          border-radius:
            50%;

          background:
            #D09A16;

          box-shadow:
            0 0 20px
            rgba(208,154,22,0.5);
        }


        .orbit {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 210px;
          height: 70px;

          border:
            1px solid
            rgba(208,154,22,0.18);

          border-radius:
            50%;

          transform:
            translate(-50%, -50%)
            rotate(25deg);

          transition:
            transform 0.8s ease;
        }


        .orbit-two {
          transform:
            translate(-50%, -50%)
            rotate(-25deg);

          border-color:
            rgba(24,35,69,0.08);
        }


        .premium-process-card:hover
        .orbit-one {
          transform:
            translate(-50%, -50%)
            rotate(34deg);
        }


        .premium-process-card:hover
        .orbit-two {
          transform:
            translate(-50%, -50%)
            rotate(-34deg);
        }


        /* =================================================
           TOWER
        ================================================= */

        .tower {
          position: absolute;

          bottom: 16px;
          left: 50%;

          width: 68px;
          height: 180px;

          transform:
            translateX(-50%)
            skewY(-3deg);

          border:
            1px solid
            rgba(24,35,69,0.18);

          background:
            linear-gradient(
              90deg,
              #ffffff,
              #f5f0e5,
              #ffffff
            );

          box-shadow:
            12px 12px 35px
            rgba(24,35,69,0.08);

          transition:
            transform 0.8s
            cubic-bezier(.2,.8,.2,1);
        }


        .premium-process-card:hover
        .tower,
        .premium-process-card.is-expanded
        .tower {
          transform:
            translateX(-50%)
            skewY(-3deg)
            translateY(-10px);
        }


        .tower-windows {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 7px;

          height: 100%;

          padding: 12px;
        }


        .tower-windows span {
          border:
            1px solid
            rgba(208,154,22,0.25);

          background:
            rgba(208,154,22,0.045);
        }


        .tower-back {
          position: absolute;

          bottom: 16px;

          left: calc(50% - 30px);

          width: 50px;
          height: 145px;

          transform:
            translateX(-50%);

          border:
            1px solid
            rgba(24,35,69,0.10);

          background:
            rgba(24,35,69,0.015);

          transition:
            transform 0.8s ease;
        }


        .premium-process-card:hover
        .tower-back,
        .premium-process-card.is-expanded
        .tower-back {
          transform:
            translateX(-50%)
            translateX(-8px);
        }


        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 1100px) {

          .premium-process-card {
            min-height: 620px;
          }

          .card-main h3 {
            font-size: 25px;
          }

        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 767px) {

          .premium-process-card {
            min-height: 610px;

            border-radius: 24px;
          }


          .card-visual {
            height: 215px;
          }


          .property-visual {
            height: 215px;
          }


          .card-main {
            padding:
              20px 23px 0;
          }


          .card-details.visible {
            max-height: 420px;

            padding:
              18px 23px 0;
          }


          .card-action {
            left: 23px;
            right: 23px;

            width:
              calc(100% - 46px);
          }


          .card-footer {
            left: 23px;
            right: 23px;
          }

        }


        /* =================================================
           REDUCED MOTION
        ================================================= */

        @media (prefers-reduced-motion: reduce) {

          .premium-process-card,
          .floor-plan,
          .cube-scene,
          .tower,
          .tower-back,
          .orbit,
          .visual-glow {
            transition: none !important;
          }

        }

      `}</style>
    </section>
  );
}