import { useEffect, useRef } from "react";
import {
  ShieldCheck,
  Compass,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  Gem,
} from "lucide-react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useCms } from "../../context/CmsContext";


/* =========================================================
   DEFAULT CMS FALLBACK
========================================================= */

const DEFAULT_REASONS_DATA = [
  {
    id: "01",

    title: "Understanding Your Requirements",

    badge: "Personalized Discovery",

    description:
      "We begin by understanding what matters most to you: the location, budget, property type, and your purpose for buying, selling, or renting. Whether you're looking for a flat in Sushant Lok, a builder floor in DLF, or a commercial office in Udyog Vihar, we tailor our approach to match your goals.",

    tags: [
      "Goal Alignment",
      "Budget Optimization",
      "Prime Location Match",
    ],
  },

  {
    id: "02",

    title: "Experience in Real Estate Industry",

    badge: "25+ Years Market Insight",

    description:
      "With deep insight into Gurgaon's property market, we understand local price trends, demand and supply dynamics, and what makes a location valuable. As an experienced top real estate consultant in DLF Gurugram, we guide you to the right property whether residential, commercial, or industrial with complete transparency and expertise.",

    tags: [
      "Micro-Market Mastery",
      "Price Trend Forecasting",
      "100% Transparency",
    ],
  },

  {
    id: "03",

    title: "Properties by Categories",

    badge: "Comprehensive Portfolio",

    description:
      "From luxury homes and builder floors to industrial warehouses and commercial spaces, we offer an extensive selection to fit your needs and budget. You'll find options that align perfectly with your lifestyle, investment goals, or business plans.",

    tags: [
      "DLF Floors & Plots",
      "Udyog Vihar Commercial",
      "Industrial Hubs",
    ],
  },
];


const REASON_ICONS = [
  Compass,
  TrendingUp,
  Layers,
];


/* =========================================================
   ARCHITECTURAL BACKGROUND
========================================================= */

function ArchitecturalBackground() {
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
          -right-40
          -top-40
          h-[600px]
          w-[600px]
          rounded-full
          bg-[#D09A16]/[0.045]
          blur-[120px]
        "
      />


      {/* Vertical architectural lines */}

      <div
        className="
          absolute
          right-[15%]
          top-0
          h-full
          w-px
          bg-[#182345]/[0.025]
        "
      />

      <div
        className="
          absolute
          right-[30%]
          top-0
          h-full
          w-px
          bg-[#182345]/[0.018]
        "
      />

      <div
        className="
          absolute
          left-[12%]
          top-0
          h-full
          w-px
          bg-[#182345]/[0.018]
        "
      />


      {/* Architectural circles */}

      <div
        className="
          absolute
          -right-40
          top-[20%]
          h-[500px]
          w-[500px]
          rounded-full
          border
          border-[#D09A16]/[0.07]
        "
      />

      <div
        className="
          absolute
          -right-10
          top-[27%]
          h-[360px]
          w-[360px]
          rounded-full
          border
          border-[#182345]/[0.035]
        "
      />


      {/* Tiny grid */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.018]
          [background-image:linear-gradient(to_right,#182345_1px,transparent_1px),linear-gradient(to_bottom,#182345_1px,transparent_1px)]
          [background-size:80px_80px]
        "
      />

    </div>
  );
}


/* =========================================================
   TRUST CARD
========================================================= */

function TrustCard({ trustCard }) {

  return (
    <div
      className="
        group
        relative
        h-full
        min-h-[600px]
        overflow-hidden
        rounded-[30px]
        border
        border-[#182345]/10
        bg-[#182345]
        shadow-[0_25px_80px_rgba(24,35,69,0.13)]
        transition-all
        duration-700
        hover:-translate-y-1
        hover:shadow-[0_35px_100px_rgba(24,35,69,0.18)]
      "
    >

      {/* =====================================================
          ARCHITECTURAL IMAGE
      ===================================================== */}

      <div className="absolute inset-0">

        <img
          src={
            trustCard.bgImage ||
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
          }
          alt="Modern Gurgaon Architecture"
          width="1200"
          height="800"
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            opacity-25
            transition-transform
            duration-[1200ms]
            group-hover:scale-105
          "
        />


        {/* Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#182345]/75
            via-[#182345]/88
            to-[#182345]
          "
        />

      </div>


      {/* =====================================================
          GOLD AMBIENT LIGHT
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-72
          w-72
          rounded-full
          bg-[#D09A16]/10
          blur-[80px]
          transition-all
          duration-700
          group-hover:bg-[#D09A16]/15
        "
      />


      {/* =====================================================
          ARCHITECTURAL FRAME
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-5
          rounded-[24px]
          border
          border-white/[0.08]
        "
      />


      {/* Corner accents */}

      <div
        className="
          absolute
          left-0
          top-0
          h-16
          w-16
          rounded-tl-[30px]
          border-l-2
          border-t-2
          border-[#D09A16]/70
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          h-16
          w-16
          rounded-br-[30px]
          border-b-2
          border-r-2
          border-[#D09A16]/70
        "
      />


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          flex-col
          justify-between
          p-8
          sm:p-10
          lg:p-12
        "
      >

        <div>

          {/* Icon */}

          <div
            className="
              mb-7
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              border
              border-[#D09A16]/40
              bg-[#D09A16]/10
              text-[#D09A16]
              shadow-[0_10px_30px_rgba(208,154,22,0.10)]
              transition-all
              duration-500
              group-hover:scale-105
              group-hover:bg-[#D09A16]
              group-hover:text-[#182345]
            "
          >
            <ShieldCheck
              size={26}
              strokeWidth={1.5}
            />
          </div>


          {/* Badge */}

          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/[0.06]
              px-3
              py-1.5
              text-[8px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#D09A16]
              backdrop-blur-md
            "
          >

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#D09A16]
              "
            />

            {trustCard.badge ||
              "Trusted Partner"}

          </div>


          {/* Title */}

          <h3
            className="
              max-w-[520px]
              font-serif
              text-3xl
              font-normal
              leading-[1.08]
              tracking-[-0.03em]
              text-white
              sm:text-4xl
            "
          >
            {trustCard.title ||
              "Property Dealers in Gurgaon You Can Trust"}
          </h3>


          {/* Gold line */}

          <div
            className="
              my-7
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                h-px
                w-12
                bg-[#D09A16]
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


          {/* Paragraph 1 */}

          <p
            className="
              max-w-[520px]
              text-xs
              leading-7
              text-white/70
              sm:text-sm
            "
          >
            {trustCard.p1}
          </p>


          {/* Paragraph 2 */}

          <p
            className="
              mt-5
              max-w-[520px]
              text-xs
              leading-7
              text-white/50
              sm:text-sm
            "
          >
            {trustCard.p2}
          </p>

        </div>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div
          className="
            mt-10
            border-t
            border-white/10
            pt-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* Trust statement */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Gem
                size={15}
                className="text-[#D09A16]"
              />

              <div>

                <span
                  className="
                    block
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-white/35
                  "
                >
                  OUR PROMISE
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-[10px]
                    font-medium
                    text-white/70
                  "
                >
                  Expertise. Transparency. Trust.
                </span>

              </div>

            </div>


            {/* CTA */}

            <Link
              to={
                trustCard.ctaLink ||
                "/about"
              }
              className="
                group/link
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-full
                bg-[#D09A16]
                px-6
                py-3.5
                text-[8px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#182345]
                shadow-[0_8px_25px_rgba(208,154,22,0.2)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
              "
            >

              <span>
                {trustCard.ctaText ||
                  "Learn More About Us"}
              </span>

              <ArrowRight
                size={14}
                className="
                  transition-transform
                  duration-300
                  group-hover/link:translate-x-1
                "
              />

            </Link>

          </div>


          {/* Brand footer */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              text-[6px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-white/20
            "
          >

            <span>
              SAUDAGAR PROPERTIES
            </span>

            <span>
              EST. 25+ YEARS
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   REASON CARD
========================================================= */

function ReasonCard({
  item,
  index,
  cardRef,
}) {

  const IconComp =
    REASON_ICONS[
    index % REASON_ICONS.length
    ] || Compass;


  return (
    <article
      ref={cardRef}
      className="
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-[#182345]/[0.09]
        bg-white
        p-6
        shadow-[0_12px_40px_rgba(24,35,69,0.045)]
        transition-all
        duration-500
        hover:-translate-y-1.5
        hover:border-[#D09A16]/35
        hover:shadow-[0_25px_65px_rgba(24,35,69,0.09)]
        sm:p-7
      "
    >

      {/* =====================================================
          LARGE NUMBER
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-2
          -top-5
          font-serif
          text-[120px]
          leading-none
          text-[#182345]/[0.035]
          transition-all
          duration-700
          group-hover:text-[#D09A16]/[0.07]
          group-hover:-translate-y-1
        "
      >
        {item.id ||
          String(index + 1).padStart(2, "0")}
      </div>


      {/* Gold top line */}

      <div
        className="
          absolute
          left-7
          top-0
          h-[2px]
          w-8
          bg-[#D09A16]
          transition-all
          duration-500
          group-hover:w-20
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
          items-start
          gap-5
        "
      >

        {/* Icon */}

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-[#182345]/10
            bg-[#F9F7F4]
            text-[#182345]
            shadow-sm
            transition-all
            duration-500
            group-hover:border-[#D09A16]
            group-hover:bg-[#D09A16]
            group-hover:text-white
            group-hover:rotate-[-4deg]
          "
        >

          <IconComp
            size={21}
            strokeWidth={1.5}
          />

        </div>


        <div
          className="
            min-w-0
            flex-1
          "
        >

          {/* Badge */}

          <div
            className="
              mb-2
              inline-flex
              rounded-full
              border
              border-[#D09A16]/20
              bg-[#D09A16]/[0.045]
              px-2.5
              py-1
              text-[7px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#A87505]
            "
          >
            {item.badge}
          </div>


          {/* Title */}

          <h4
            className="
              font-serif
              text-xl
              font-normal
              leading-[1.15]
              tracking-[-0.025em]
              text-[#182345]
              sm:text-[22px]
            "
          >
            {item.title}
          </h4>

        </div>

      </div>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p
        className="
          relative
          z-10
          mt-5
          text-[11px]
          leading-6
          text-[#5D667D]
          sm:text-xs
          sm:leading-6
        "
      >
        {item.description}
      </p>


      {/* =====================================================
          TAGS
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mt-5
          flex
          flex-wrap
          gap-2
        "
      >

        {(item.tags || []).map(
          (tag, tagIndex) => (
            <span
              key={tagIndex}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-[#182345]/[0.07]
                bg-[#F9F7F4]
                px-2.5
                py-1.5
                text-[8px]
                font-medium
                text-[#182345]/75
                transition-all
                duration-300
                group-hover:border-[#D09A16]/20
              "
            >

              <CheckCircle2
                size={11}
                className="text-[#D09A16]"
              />

              {tag}

            </span>
          )
        )}

      </div>


      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-[#182345]/[0.07]
          pt-4
        "
      >

        <span
          className="
            text-[6px]
            font-bold
            uppercase
            tracking-[0.22em]
            text-[#182345]/25
          "
        >
          SAUDAGAR ADVANTAGE
        </span>


        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-[#D09A16]/20
            text-[#D09A16]
            transition-all
            duration-400
            group-hover:border-[#D09A16]
            group-hover:bg-[#D09A16]
            group-hover:text-white
          "
        >

          <ArrowUpRight
            size={13}
          />

        </div>

      </div>

    </article>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WhyChooseUsSection() {

  const { sections } = useCms();

  /*
   * IMPORTANT:
   * Keep the existing CMS structure intact.
   */

  const whyData =
    sections?.whyChooseUs || {};


  const badge =
    whyData.badge ||
    "The Saudagar Advantage";


  const titleMain =
    whyData.titleMain ||
    "Why Choose";


  const titleItalic =
    whyData.titleItalic ||
    "Our Company?";


  const description =
    whyData.description ||
    "Decades of unmatched local authority, ethical advisory, and client-first commitment across Gurgaon.";


  const trustCard =
    whyData.trustCard || {
      badge: "Trusted Partner",

      title:
        "Property Dealers in Gurgaon You Can Trust",

      p1:
        "We help customers buy, sell, and rent residential, commercial, and industrial properties across prime areas of Gurgaon and Gurugram, including DLF, Sushant Lok, and Udyog Vihar.",

      p2:
        "We're your one-stop platform for smart property solutions combining local expertise with the best deals to match your needs and budget.",

      bgImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",

      ctaText:
        "Learn More About Us",

      ctaLink:
        "/about",
    };


  const reasons =
    whyData.reasons ||
    DEFAULT_REASONS_DATA;


  const sectionRef =
    useRef(null);


  const headerRef =
    useRef(null);


  const trustCardRef =
    useRef(null);


  const reasonCardsRef =
    useRef([]);


  /* =====================================================
     SIMPLE ENTRANCE ANIMATION
     
     NO SCROLL-DRIVEN PINNING
     NO LONG SCROLL ANIMATION
  ===================================================== */

  useEffect(() => {

    const ctx =
      gsap.context(() => {

        const reduceMotion =
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;


        if (reduceMotion) {

          gsap.set(
            [
              headerRef.current,
              trustCardRef.current,
              ...reasonCardsRef.current,
            ],
            {
              opacity: 1,
              clearProps: "all",
            }
          );

          return;
        }


        /* Header */

        if (headerRef.current) {

          gsap.fromTo(
            headerRef.current,
            {
              opacity: 0,
              y: 22,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            }
          );

        }


        /* Trust card */

        if (trustCardRef.current) {

          gsap.fromTo(
            trustCardRef.current,
            {
              opacity: 0,
              x: -25,
              rotateY: 4,
            },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              duration: 0.9,
              delay: 0.12,
              ease: "power3.out",
            }
          );

        }


        /* Reason cards */

        const validCards =
          reasonCardsRef.current.filter(Boolean);


        if (validCards.length) {

          gsap.fromTo(
            validCards,
            {
              opacity: 0,
              x: 25,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.75,
              stagger: 0.1,
              delay: 0.18,
              ease: "power3.out",
            }
          );

        }

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
        border-[#182345]/[0.06]
        bg-[#F9F7F4]
        py-12
        text-[#182345]
        lg:py-20
      "
    >

      <ArchitecturalBackground />


      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-5
          sm:px-8
          lg:px-12
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          ref={headerRef}
          className="
            mx-auto
            mb-14
            max-w-4xl
            text-center
            lg:mb-16
          "
        >

          {/* Badge */}

          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#D09A16]/25
              bg-white/70
              px-4
              py-2
              text-[8px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-[#A87505]
              shadow-sm
              backdrop-blur-sm
            "
          >

            <Sparkles
              size={11}
              className="text-[#D09A16]"
            />

            {badge}

          </div>


          {/* Decorative divider */}

          <div
            className="
              mb-5
              flex
              items-center
              justify-center
              gap-3
            "
          >

            <span
              className="
                h-px
                w-10
                bg-[#D09A16]/50
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

            <span
              className="
                h-px
                w-10
                bg-[#D09A16]/50
              "
            />

          </div>


          {/* Title */}

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


          {/* Description */}

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


          {/* Small positioning statement */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-3
              text-[7px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-[#182345]/30
            "
          >

            <span>
              LOCAL KNOWLEDGE
            </span>

            <span
              className="
                h-1
                w-1
                rounded-full
                bg-[#D09A16]
              "
            />

            <span>
              ETHICAL ADVISORY
            </span>

            <span
              className="
                h-1
                w-1
                rounded-full
                bg-[#D09A16]
              "
            />

            <span>
              LONG-TERM TRUST
            </span>

          </div>

        </div>


        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            items-stretch
            gap-6
            lg:grid-cols-12
            lg:gap-7
          "
        >

          {/* =================================================
              TRUST CARD
          ================================================= */}

          <div
            ref={trustCardRef}
            className="
              lg:col-span-5
              [perspective:1200px]
            "
          >

            <TrustCard
              trustCard={trustCard}
            />

          </div>


          {/* =================================================
              REASONS
          ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-5
              lg:col-span-7
            "
          >

            {reasons.map(
              (item, index) => (

                <ReasonCard
                  key={
                    item.id ||
                    index
                  }
                  item={item}
                  index={index}
                  cardRef={(el) => {
                    reasonCardsRef.current[
                      index
                    ] = el;
                  }}
                />

              )
            )}

          </div>

        </div>


        {/* =================================================
            BOTTOM MICRO STATEMENT
        ================================================= */}

        <div
          className="
            mt-10
            flex
            flex-col
            items-center
            justify-center
            gap-3
            text-center
            sm:flex-row
          "
        >

          <Building2
            size={14}
            className="text-[#D09A16]"
          />

          <span
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#182345]/30
            "
          >
            Residential · Commercial · Industrial
          </span>

          <span
            className="
              hidden
              h-px
              w-8
              bg-[#D09A16]/30
              sm:block
            "
          />

          <span
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#182345]/30
            "
          >
            Gurgaon & Gurugram
          </span>

        </div>

      </div>

    </section>

  );
}