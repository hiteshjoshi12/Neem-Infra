import { useEffect, useRef, useState } from "react";
import {
  PhoneCall,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  ArrowUpRight,
  Building2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCms } from "../../../context/CmsContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


/* =========================================================
   COUNTER
========================================================= */

function GsapCounter({ end, suffix = "+" }) {
  const [val, setVal] = useState(0);
  const spanRef = useRef(null);

  useEffect(() => {
    const element = spanRef.current;

    if (!element) return;

    const ctx = gsap.context(() => {
      const counter = { num: 0 };
      const targetEnd = Number(end) || 0;

      gsap.to(counter, {
        num: targetEnd,
        duration: 1.8,
        ease: "power2.out",

        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true,
        },

        onUpdate: () => {
          setVal(Math.round(counter.num));
        },
      });
    }, spanRef);

    return () => ctx.revert();
  }, [end]);

  return (
    <span
      ref={spanRef}
      className="tabular-nums"
    >
      {val >= 1000
        ? val.toLocaleString("en-IN")
        : val}
      {suffix}
    </span>
  );
}


/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_STATS_CARDS = [
  {
    number: 100,
    suffix: "+",
    label: "CR Saves In Property Investment",
    subtext:
      "Maximized financial yield & smart negotiation",
  },
  {
    number: 1000,
    suffix: "+",
    label: "Happy Clients",
    subtext:
      "Discerning families & corporate enterprises",
  },
  {
    number: 25,
    suffix: "+",
    label: "Years of Trust and Experience",
    subtext:
      "Unbroken leadership in DLF Gurugram",
  },
];


const STATS_ICONS = [
  TrendingUp,
  Users,
  Award,
];


/* =========================================================
   ARCHITECTURAL BACKGROUND
========================================================= */

function ArchitecturalBackdrop() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
      aria-hidden="true"
    >

      {/* Ambient gold */}

      <div
        className="
          absolute
          -right-32
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#D09A16]/[0.055]
          blur-[110px]
        "
      />


      {/* Architectural verticals */}

      <div
        className="
          absolute
          right-[8%]
          top-0
          h-full
          w-px
          bg-[#182345]/[0.035]
        "
      />

      <div
        className="
          absolute
          right-[18%]
          top-0
          h-full
          w-px
          bg-[#182345]/[0.025]
        "
      />


      {/* Large architectural circle */}

      <div
        className="
          absolute
          -right-32
          top-1/2
          h-[430px]
          w-[430px]
          -translate-y-1/2
          rounded-full
          border
          border-[#D09A16]/[0.08]
        "
      />

      <div
        className="
          absolute
          -right-20
          top-1/2
          h-[300px]
          w-[300px]
          -translate-y-1/2
          rounded-full
          border
          border-[#182345]/[0.035]
        "
      />

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function LuxuryStatCard({
  stat,
  index,
  cardRef,
}) {
  const Icon =
    STATS_ICONS[index % STATS_ICONS.length] ||
    TrendingUp;

  return (
    <div
      ref={cardRef}
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-[#182345]/[0.09]
        bg-white/75
        p-6
        shadow-[0_12px_45px_rgba(24,35,69,0.045)]
        backdrop-blur-sm
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-[#D09A16]/35
        hover:bg-white
        hover:shadow-[0_25px_65px_rgba(24,35,69,0.09)]
      "
    >

      {/* Gold accent */}

      <div
        className="
          absolute
          left-6
          top-0
          h-[2px]
          w-8
          bg-[#D09A16]
          transition-all
          duration-500
          group-hover:w-16
        "
      />


      {/* Large background number */}

      <div
        className="
          pointer-events-none
          absolute
          -right-2
          -top-5
          font-serif
          text-[110px]
          leading-none
          text-[#182345]/[0.025]
          transition-all
          duration-700
          group-hover:text-[#D09A16]/[0.06]
        "
      >
        0{index + 1}
      </div>


      {/* Icon */}

      <div
        className="
          relative
          z-10
          mb-6
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
          group-hover:bg-[#D09A16]
          group-hover:text-white
          group-hover:shadow-[0_8px_25px_rgba(208,154,22,0.25)]
        "
      >
        <Icon
          size={18}
          strokeWidth={1.5}
        />
      </div>


      {/* Number */}

      <div
        className="
          relative
          z-10
          mb-2
          font-serif
          text-5xl
          font-normal
          tracking-[-0.045em]
          text-[#182345]
          sm:text-6xl
        "
      >
        <GsapCounter
          end={stat.number}
          suffix={stat.suffix}
        />
      </div>


      {/* Label */}

      <h4
        className="
          relative
          z-10
          max-w-[230px]
          text-[9px]
          font-bold
          uppercase
          leading-5
          tracking-[0.16em]
          text-[#182345]
        "
      >
        {stat.label}
      </h4>


      {/* Subtext */}

      <p
        className="
          relative
          z-10
          mt-3
          max-w-[250px]
          text-[11px]
          leading-5
          text-[#5D667D]
        "
      >
        {stat.subtext}
      </p>


      {/* Bottom arrow */}

      <div
        className="
          mt-6
          flex
          items-center
          gap-2
          border-t
          border-[#182345]/[0.07]
          pt-4
          text-[7px]
          font-bold
          uppercase
          tracking-[0.2em]
          text-[#182345]/30
        "
      >

        <span>
          VERIFIED EXPERIENCE
        </span>

        <span
          className="
            h-px
            w-5
            bg-[#D09A16]/40
            transition-all
            duration-500
            group-hover:w-10
          "
        />

      </div>

    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DlfPropertyCallout() {

  const { sections } = useCms();

  const callout =
    sections?.dlfCallout ||
    sections?.services?.dlfCallout ||
    {};


  const statsCards =
    callout.statsCards ||
    DEFAULT_STATS_CARDS;


  const badge =
    callout.badge ||
    "DLF Gurgaon Dedicated Desk";


  const headline =
    callout.headline ||
    "Are you looking for a property in DLF Gurgaon? Simply connect with us!";


  const description =
    callout.description ||
    "Our expert team is ready to assist you with a wide range of residential, commercial, and industrial properties tailored to your preferences and convenience. Contact us to discuss your requirements and find the perfect property solution.";


  const phone =
    callout.phone ||
    "+91 98112 21207";


  const phoneRaw =
    callout.phoneRaw ||
    phone.replace(/\s+/g, "");


  const containerRef =
    useRef(null);


  const cardRefs =
    useRef([]);


  const bannerRef =
    useRef(null);


  /* =====================================================
     ENTRANCE ANIMATION
  ===================================================== */

  useEffect(() => {

    const ctx = gsap.context(() => {

      const reduceMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;


      if (reduceMotion) return;


      gsap.fromTo(
        ".dlf-header > *",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",

          scrollTrigger: {
            trigger: ".dlf-header",
            start: "top 88%",
            once: true,
          },
        }
      );


      gsap.fromTo(
        cardRefs.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",

          scrollTrigger: {
            trigger: ".dlf-stats",
            start: "top 88%",
            once: true,
          },
        }
      );


      if (bannerRef.current) {

        gsap.fromTo(
          bannerRef.current,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",

            scrollTrigger: {
              trigger: bannerRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );

      }

    }, containerRef);


    return () => ctx.revert();

  }, [statsCards]);


  return (

    <section
      ref={containerRef}
      className="
        relative
        mt-20
        overflow-hidden
        bg-[#F9F7F4]
        px-5
        py-20
        sm:px-8
        lg:mt-28
        lg:px-12
        lg:py-28
      "
    >

      <ArchitecturalBackdrop />


      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          dlf-header
          relative
          z-10
          mx-auto
          mb-12
          max-w-7xl
        "
      >

        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          {/* LEFT */}

          <div>

            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#D09A16]/25
                bg-[#D09A16]/[0.05]
                px-4
                py-2
                text-[8px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#A87505]
              "
            >

              <Sparkles size={11} />

              {badge}

            </div>


            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  h-px
                  w-10
                  bg-[#D09A16]/60
                "
              />

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#D09A16]
                "
              />

            </div>


            <h2
              className="
                mt-5
                max-w-3xl
                font-serif
                text-4xl
                font-normal
                leading-[1.05]
                tracking-[-0.04em]
                text-[#182345]
                sm:text-5xl
                lg:text-6xl
              "
            >
              DLF Gurugram,
              <span
                className="
                  ml-2
                  italic
                  font-light
                  text-[#D09A16]
                "
              >
                considered differently.
              </span>
            </h2>

          </div>


          {/* RIGHT LOCATION */}

          <div
            className="
              flex
              items-center
              gap-3
              lg:pb-2
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#D09A16]/25
                bg-white/70
                text-[#D09A16]
              "
            >
              <MapPin size={16} />
            </div>


            <div>

              <span
                className="
                  block
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#182345]/35
                "
              >
                LOCAL EXPERTISE
              </span>

              <span
                className="
                  mt-1
                  block
                  font-serif
                  text-lg
                  text-[#182345]
                "
              >
                DLF Gurugram
              </span>

            </div>

          </div>

        </div>


        <p
          className="
            mt-6
            max-w-2xl
            text-sm
            leading-7
            text-[#5D667D]
            sm:text-base
          "
        >
          {description}
        </p>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div
        className="
          dlf-stats
          relative
          z-10
          mx-auto
          grid
          max-w-7xl
          grid-cols-1
          gap-5
          md:grid-cols-3
          lg:gap-6
        "
      >

        {statsCards.map(
          (stat, index) => (

            <LuxuryStatCard
              key={index}
              stat={stat}
              index={index}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
            />

          )
        )}

      </div>


      {/* =================================================
          CONTACT PANEL
      ================================================= */}

      <div
        ref={bannerRef}
        className="
          relative
          z-10
          mx-auto
          mt-7
          max-w-7xl
          overflow-hidden
          rounded-[28px]
          border
          border-[#182345]/10
          bg-[#182345]
          shadow-[0_25px_80px_rgba(24,35,69,0.12)]
        "
      >

        {/* Gold ambient */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-40
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#D09A16]/10
            blur-[90px]
          "
        />


        {/* architectural lines */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.04]
          "
        >

          <div
            className="
              absolute
              right-[20%]
              top-0
              h-full
              w-px
              bg-white
            "
          />

          <div
            className="
              absolute
              right-[35%]
              top-0
              h-full
              w-px
              bg-white
            "
          />

          <div
            className="
              absolute
              right-[50%]
              top-0
              h-full
              w-px
              bg-white
            "
          />

        </div>


        <div
          className="
            relative
            z-10
            grid
            items-center
            gap-8
            p-7
            sm:p-9
            lg:grid-cols-[1fr_auto]
            lg:p-12
          "
        >

          {/* LEFT */}

          <div>

            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >

              <Building2
                size={15}
                className="text-[#D09A16]"
              />

              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-[#D09A16]
                "
              >
                PRIVATE PROPERTY DESK
              </span>

            </div>


            <h3
              className="
                max-w-3xl
                font-serif
                text-2xl
                font-normal
                leading-tight
                text-white
                sm:text-3xl
                lg:text-4xl
              "
            >
              {headline}
            </h3>


            <div
              className="
                mt-5
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  h-px
                  w-10
                  bg-[#D09A16]
                "
              />

              <span
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white/40
                "
              >
                RESIDENTIAL · COMMERCIAL · INDUSTRIAL
              </span>

            </div>

          </div>


          {/* RIGHT */}

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
            "
          >

            {/* Phone */}

            <a
              href={`tel:${phoneRaw}`}
              className="
                group
                flex
                items-center
                justify-center
                gap-3
                rounded-full
                border
                border-white/15
                bg-white/[0.06]
                px-6
                py-3.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white
                transition-all
                duration-300
                hover:border-[#D09A16]/50
                hover:bg-white/[0.10]
              "
            >

              <PhoneCall
                size={14}
                className="
                  text-[#D09A16]
                  transition-transform
                  duration-300
                  group-hover:rotate-12
                "
              />

              {phone}

            </a>


            {/* CTA */}

            <Link
              to={
                callout.ctaLink ||
                "/contact"
              }
              className="
                group
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#D09A16]
                px-7
                py-3.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#182345]
                shadow-[0_8px_25px_rgba(208,154,22,0.20)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:shadow-[0_12px_35px_rgba(255,255,255,0.10)]
              "
            >

              <span>
                {callout.ctaText ||
                  "Explore Deals"}
              </span>

              <ArrowUpRight
                size={15}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />

            </Link>

          </div>

        </div>


        {/* bottom brand line */}

        <div
          className="
            relative
            z-10
            flex
            items-center
            justify-between
            border-t
            border-white/[0.07]
            px-7
            py-4
            sm:px-9
            lg:px-12
          "
        >

          <span
            className="
              text-[6px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-white/25
            "
          >
            SAUDAGAR PROPERTIES PVT LTD
          </span>


          <span
            className="
              text-[6px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-[#D09A16]/60
            "
          >
            DLF GURUGRAM
          </span>

        </div>

      </div>

    </section>
  );
}