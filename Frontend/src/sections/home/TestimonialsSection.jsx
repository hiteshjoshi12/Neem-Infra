import { useEffect, useRef, useState } from "react";
import {
  Quote,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCms } from "../../context/CmsContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


/* =========================================================
   DEFAULT TESTIMONIALS
   ---------------------------------------------------------
   CMS remains the primary source.
========================================================= */

const TESTIMONIALS = [
  {
    id: "01",
    name: "Deepak Arora",
    role: "Investor",
    location: "Dubai, UAE",
    rating: 5,
    avatar:
      "https://saudagarproperties.com/wp-content/uploads/2021/01/c3.jpg",
    quote:
      "Selecting a best real estate consultant in Gurugram, especially one who is trustworthy, experienced, and honest, is the basic pillar of investment. From their before sales to after sales service, I can definitely say that customer satisfaction is in the company's DNA. Extremely happy to approach them for my investment decisions and will look up to the same in future too.",
    tag: "NRI Investment Advisory",
  },
  {
    id: "02",
    name: "Kedarnath Gupta",
    role: "Investor",
    location: "Dubai, UAE",
    rating: 5,
    avatar:
      "https://saudagarproperties.com/wp-content/uploads/2021/01/c2.jpg",
    quote:
      "Choosing the right home is a very important aspect of any individual's life. With their decade-long experience in the Gurgaon real estate market, Saudagar Properties Pvt. Ltd. played a key role in ensuring that I was making the right decision while choosing my dream home by providing the right push when needed, and cautioning me when necessary. I owe the team a huge part of my dream.",
    tag: "High-Value Transaction",
  },
  {
    id: "03",
    name: "Saravjit Dasaan",
    role: "Investor & End User",
    location: "India",
    rating: 5,
    avatar:
      "https://saudagarproperties.com/wp-content/uploads/2021/01/c1.jpg",
    quote:
      "The team seamlessly took over everything, from research, visit, paperwork to maintenance. Amidst a plethora of options, Saudagar Properties shortlisted the best residential properties in Gurgaon according to my needs and comfort. It has been a delight working with the highly-qualified and seasoned team. I would recommend their services to all my friends and acquaintances.",
    tag: "End-to-End Concierge",
  },
];


/* =========================================================
   STAR RATING
========================================================= */

function Rating({ rating = 5 }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: rating }).map((_, index) => (
        <Star
          key={index}
          size={13}
          fill="currentColor"
          className="text-[#D09A16]"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}


/* =========================================================
   LOCATION LABEL
========================================================= */

function LocationLabel({ location }) {
  if (!location) return null;

  return (
    <span
      className="
        inline-flex
        items-center
        rounded-full
        border
        border-[#182345]/[0.08]
        bg-[#F9F7F4]
        px-2.5
        py-1
        text-[7px]
        font-semibold
        uppercase
        tracking-[0.15em]
        text-[#182345]/55
      "
    >
      {location}
    </span>
  );
}


/* =========================================================
   FEATURED TESTIMONIAL
========================================================= */

function FeaturedTestimonial({ item }) {
  if (!item) return null;

  return (
    <article
      itemScope
      itemType="https://schema.org/Review"
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-[#182345]/10
        bg-[#182345]
        p-7
        shadow-[0_25px_70px_rgba(24,35,69,0.12)]
        sm:p-9
        lg:p-10
      "
    >

      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-28
          -top-28
          h-[330px]
          w-[330px]
          rounded-full
          bg-[#D09A16]/10
          blur-[80px]
          transition-all
          duration-700
          group-hover:bg-[#D09A16]/15
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-[220px]
          w-[220px]
          rounded-full
          bg-white/[0.02]
          blur-[70px]
        "
      />


      {/* Architectural line */}

      <div
        className="
          pointer-events-none
          absolute
          right-[18%]
          top-0
          h-full
          w-px
          bg-white/[0.045]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[32%]
          top-0
          h-full
          w-px
          bg-white/[0.025]
        "
      />


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10">

        {/* Top row */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
          "
        >

          <div
            className="
              inline-flex
              items-center
              gap-2
              text-[7px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#D09A16]
            "
          >
            <ShieldCheck size={12} />

            Client Perspective
          </div>


          <div
            className="
              rounded-full
              border
              border-white/10
              bg-white/[0.05]
              px-3
              py-1.5
            "
          >
            <span
              className="
                text-[7px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-white/55
              "
            >
              {item.tag || "Client Experience"}
            </span>
          </div>

        </div>


        {/* Quote */}

        <div className="relative mt-8">

          <Quote
            size={58}
            strokeWidth={1}
            className="
              absolute
              -left-2
              -top-6
              text-[#D09A16]/15
            "
            aria-hidden="true"
          />


          <blockquote
            itemProp="reviewBody"
            className="
              relative
              max-w-3xl
              font-serif
              text-xl
              font-normal
              leading-[1.55]
              tracking-[-0.015em]
              text-white
              sm:text-2xl
              lg:text-[27px]
            "
          >
            “{item.quote}”
          </blockquote>

        </div>


        {/* Divider */}

        <div
          className="
            my-8
            h-px
            w-full
            bg-white/[0.09]
          "
        />


        {/* Author */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-5
          "
        >

          <div className="flex items-center gap-4">

            {/* Avatar */}

            <div
              className="
                h-14
                w-14
                shrink-0
                rounded-2xl
                bg-gradient-to-br
                from-[#D09A16]
                via-[#F9F7F4]
                to-[#A87505]
                p-[2px]
                shadow-[0_8px_25px_rgba(208,154,22,0.20)]
              "
            >

              <img
                src={item.avatar}
                alt={`${item.name} — Saudagar Properties client`}
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
                itemProp="image"
                className="
                  h-full
                  w-full
                  rounded-[13px]
                  object-cover
                  object-top
                "
              />

            </div>


            <div>

              <cite
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
                className="not-italic"
              >

                <span
                  itemProp="name"
                  className="
                    block
                    font-serif
                    text-lg
                    font-normal
                    text-white
                  "
                >
                  {item.name}
                </span>

              </cite>


              <div
                className="
                  mt-1
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.17em]
                    text-[#D09A16]
                  "
                >
                  {item.role}
                </span>

                <span className="h-1 w-1 rounded-full bg-white/20" />

                <span
                  className="
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-white/40
                  "
                  itemProp="locationCreated"
                >
                  {item.location}
                </span>

              </div>

            </div>

          </div>


          {/* Rating */}

          <div
            itemProp="reviewRating"
            itemScope
            itemType="https://schema.org/Rating"
            className="hidden sm:block"
          >

            <meta
              itemProp="ratingValue"
              content={String(item.rating || 5)}
            />

            <meta
              itemProp="bestRating"
              content="5"
            />

            <Rating rating={item.rating || 5} />

          </div>

        </div>

      </div>

    </article>
  );
}


/* =========================================================
   COMPACT TESTIMONIAL CARD
========================================================= */

function CompactTestimonial({ item, index, onSelect, active }) {

  return (
    <article
      itemScope
      itemType="https://schema.org/Review"
      className={`
        group
        relative
        min-w-[280px]
        snap-start
        overflow-hidden
        rounded-[22px]
        border
        bg-white
        p-5
        transition-all
        duration-400
        sm:min-w-0
        ${active
          ? "border-[#D09A16]/45 shadow-[0_15px_45px_rgba(24,35,69,0.08)]"
          : "border-[#182345]/[0.08] shadow-[0_8px_30px_rgba(24,35,69,0.04)]"
        }
      `}
    >

      {/* Gold accent */}

      <div
        className="
          absolute
          left-5
          right-5
          top-0
          h-[2px]
          origin-left
          bg-[#D09A16]
          transition-transform
          duration-500
          scale-x-0
          group-hover:scale-x-100
        "
      />


      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <Rating rating={item.rating || 5} />

        <span
          className="
            text-[7px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#182345]/25
          "
        >
          {item.id || `0${index + 1}`}
        </span>

      </div>


      {/* Quote preview */}

      <blockquote
        itemProp="reviewBody"
        className="
          mt-5
          line-clamp-4
          text-[11px]
          leading-6
          text-[#4F5A70]
        "
      >
        “{item.quote}”
      </blockquote>


      {/* Author */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-[#182345]/[0.07]
          pt-4
        "
      >

        <div className="flex min-w-0 items-center gap-3">

          <img
            src={item.avatar}
            alt={`${item.name} — Saudagar Properties client`}
            width="42"
            height="42"
            loading="lazy"
            decoding="async"
            itemProp="image"
            className="
              h-10
              w-10
              shrink-0
              rounded-xl
              object-cover
              object-top
              ring-1
              ring-[#D09A16]/25
            "
          />


          <div className="min-w-0">

            <cite
              itemProp="author"
              itemScope
              itemType="https://schema.org/Person"
              className="not-italic"
            >

              <span
                itemProp="name"
                className="
                  block
                  truncate
                  font-serif
                  text-sm
                  text-[#182345]
                "
              >
                {item.name}
              </span>

            </cite>


            <span
              className="
                mt-0.5
                block
                truncate
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#A87505]
              "
            >
              {item.role}
            </span>

          </div>

        </div>


        <button
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Read testimonial from ${item.name}`}
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#D09A16]/25
            text-[#D09A16]
            transition-all
            duration-300
            hover:bg-[#D09A16]
            hover:text-white
          "
        >
          <ArrowUpRight size={13} />
        </button>

      </div>


      {/* Hidden semantic location */}

      <meta
        itemProp="locationCreated"
        content={item.location || ""}
      />

    </article>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TestimonialsSection() {

  const { testimonials, sections } = useCms();


  /*
   * IMPORTANT:
   * CMS remains the primary source.
   */

  const list =
    testimonials &&
      testimonials.length > 0
      ? testimonials
      : TESTIMONIALS;


  const testData =
    sections?.testimonials || {};


  const [activeIndex, setActiveIndex] =
    useState(0);


  const sectionRef =
    useRef(null);


  const headerRef =
    useRef(null);


  const featuredRef =
    useRef(null);


  const railRef =
    useRef(null);


  const currentItem =
    list[activeIndex] ||
    list[0] ||
    {};


  /* =====================================================
     SELECT TESTIMONIAL
  ===================================================== */

  const handleSelect = (index) => {

    setActiveIndex(index);

    if (
      featuredRef.current
    ) {

      gsap.fromTo(
        featuredRef.current,
        {
          opacity: 0.45,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        }
      );

    }

  };


  const handleNext = () => {

    if (!list.length) return;

    handleSelect(
      (activeIndex + 1) %
      list.length
    );

  };


  const handlePrev = () => {

    if (!list.length) return;

    handleSelect(
      (activeIndex - 1 + list.length) %
      list.length
    );

  };


  /* =====================================================
     ENTRANCE ANIMATION
     -----------------------------------------------------
     Short reveal only.
     No pinned scroll animation.
  ===================================================== */

  useEffect(() => {

    const ctx = gsap.context(() => {

      const reduceMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;


      if (reduceMotion) return;


      if (headerRef.current) {

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

            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );

      }


      if (featuredRef.current) {

        gsap.fromTo(
          featuredRef.current,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );

      }


      if (railRef.current) {

        gsap.fromTo(
          railRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: "power3.out",

            scrollTrigger: {
              trigger: railRef.current,
              start: "top 92%",
              once: true,
            },
          }
        );

      }

    }, sectionRef);


    return () => ctx.revert();

  }, [list.length]);


  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (!list.length) {
    return null;
  }


  return (

    <section
      ref={sectionRef}
      aria-labelledby="client-testimonials-heading"
      className="
        relative
        w-full
        overflow-hidden
        border-t
        border-[#182345]/[0.06]
        bg-[#F9F7F4]
        py-16
        sm:py-20
        lg:py-24
      "
    >

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-[-160px]
          h-[430px]
          w-[430px]
          rounded-full
          bg-[#D09A16]/[0.035]
          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[-150px]
          bottom-[-200px]
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#182345]/[0.02]
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.018]
          [background-image:linear-gradient(to_right,#182345_1px,transparent_1px),linear-gradient(to_bottom,#182345_1px,transparent_1px)]
          [background-size:100px_100px]
        "
      />


      {/* ===================================================
          CONTAINER
      =================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          px-5
          sm:px-7
          lg:px-8
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          ref={headerRef}
          className="
            mb-10
            flex
            flex-col
            gap-6
            lg:mb-12
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div className="max-w-2xl">

            {/* Badge */}

            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#D09A16]/25
                bg-white/70
                px-3.5
                py-1.5
                text-[7px]
                font-bold
                uppercase
                tracking-[0.23em]
                text-[#A87505]
                shadow-sm
              "
            >

              <Sparkles
                size={10}
                className="text-[#D09A16]"
              />

              {testData.badge ||
                "Client Perspectives"}

            </div>


            {/* SEO/AEO heading */}

            <h2
              id="client-testimonials-heading"
              className="
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

              {testData.titleMain ||
                "Words of"}

              <span
                className="
                  ml-2
                  italic
                  font-light
                  text-[#D09A16]
                "
              >
                {testData.titleItalic ||
                  "Distinction"}
              </span>

            </h2>


            {/* Local semantic copy */}

            <p
              className="
                mt-4
                max-w-xl
                text-xs
                leading-6
                text-[#5D667D]
                sm:text-sm
              "
            >
              {testData.description ||
                "Hear directly from clients who have worked with Saudagar Properties for residential, commercial and investment property requirements in Gurgaon and Gurugram."}
            </p>

          </div>


          {/* Right context */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-3
              lg:pb-1
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
                bg-white
                text-[#D09A16]
                shadow-sm
              "
            >
              <ShieldCheck size={16} />
            </div>


            <div>

              <span
                className="
                  block
                  text-[6px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#182345]/30
                "
              >
                CLIENT EXPERIENCE
              </span>

              <span
                className="
                  mt-1
                  block
                  font-serif
                  text-base
                  text-[#182345]
                "
              >
                Gurgaon · Gurugram
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            FEATURED TESTIMONIAL
        ================================================= */}

        <div
          ref={featuredRef}
          className="
            [perspective:1200px]
          "
        >

          <FeaturedTestimonial
            item={currentItem}
          />

        </div>


        {/* =================================================
            TESTIMONIAL NAVIGATION
        ================================================= */}

        <div
          ref={railRef}
          className="mt-5"
        >

          {/* Desktop / tablet */}

          <div
            className="
              hidden
              grid-cols-3
              gap-4
              md:grid
            "
          >

            {list.map(
              (item, index) => (

                <CompactTestimonial
                  key={
                    item._id ||
                    item.id ||
                    index
                  }
                  item={item}
                  index={index}
                  active={
                    index === activeIndex
                  }
                  onSelect={handleSelect}
                />

              )
            )}

          </div>


          {/* Mobile horizontal rail */}

          <div
            className="
              flex
              snap-x
              snap-mandatory
              gap-3
              overflow-x-auto
              pb-2
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              md:hidden
            "
          >

            {list.map(
              (item, index) => (

                <CompactTestimonial
                  key={
                    item._id ||
                    item.id ||
                    index
                  }
                  item={item}
                  index={index}
                  active={
                    index === activeIndex
                  }
                  onSelect={handleSelect}
                />

              )
            )}

          </div>


          {/* =================================================
              MOBILE / SMALL CONTROLS
          ================================================= */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              md:hidden
            "
          >

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous client testimonial"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#182345]/10
                  bg-white
                  text-[#182345]
                  transition-all
                  hover:border-[#D09A16]
                  hover:text-[#D09A16]
                "
              >
                <ChevronLeft size={16} />
              </button>


              <button
                type="button"
                onClick={handleNext}
                aria-label="Next client testimonial"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#182345]/10
                  bg-white
                  text-[#182345]
                  transition-all
                  hover:border-[#D09A16]
                  hover:text-[#D09A16]
                "
              >
                <ChevronRight size={16} />
              </button>

            </div>


            <span
              className="
                text-[7px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#182345]/30
              "
            >
              {activeIndex + 1} / {list.length}
            </span>

          </div>

        </div>


        {/* =================================================
            BOTTOM SEO / TRUST CONTEXT
        ================================================= */}

        <div
          className="
            mt-8
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-4
            gap-y-2
            text-center
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
            Residential Property
          </span>

          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

          <span
            className="
              text-[6px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#182345]/25
            "
          >
            Commercial Property
          </span>

          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

          <span
            className="
              text-[6px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#182345]/25
            "
          >
            Property Investment
          </span>

          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

          <span
            className="
              text-[6px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#182345]/25
            "
          >
            Gurgaon & Gurugram
          </span>

        </div>

      </div>

    </section>
  );
}