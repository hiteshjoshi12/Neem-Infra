"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useCms } from "../../context/CmsContext";
import NewsletterSection from "./NewsletterSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LocationMap() {
  const { sections } = useCms();

  /*
   * =========================================================
   * CMS DATA
   * ---------------------------------------------------------
   * Existing CMS structure is preserved.
   * =========================================================
   */

  const locData = sections?.location || {};

  const badge =
    locData.badge ||
    "Visit Our Office";

  const titleMain =
    locData.titleMain ||
    "Where to";

  const titleItalic =
    locData.titleItalic ||
    "Find Us";

  const description =
    locData.description ||
    "Drop by our headquarters for a private, one-on-one consultation regarding Gurgaon's premier luxury properties.";

  const officeName =
    locData.officeName ||
    "Saudagar Properties Pvt. Ltd";

  const address =
    locData.address ||
    "38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002";

  const gmapsUrl =
    locData.gmapsUrl ||
    "https://www.google.com/maps/place/Saudagar+Properties+Pvt.Ltd/@28.4847851,77.0842655,17z/data=!3m1!4b1!4m6!3m5!1s0x390d193a8eabbb6b:0x3d99d3fce74198d5!8m2!3d28.4847851!4d77.0842655!16s%2Fg%2F11f03pch1x";

  const embedUrl =
    locData.embedUrl ||
    "https://maps.google.com/maps?q=Saudagar+Properties+Pvt.Ltd,+Akashneem+Marg,+DLF+Phase+2,+Gurugram&t=&z=16&ie=UTF8&iwloc=&output=embed";

  const openMapsText =
    locData.openMapsText ||
    "Open in Google Maps";

  const officeBadge =
    locData.officeBadge ||
    "Headquarters";

  const directionsText =
    locData.directionsText ||
    "Get Directions";


  /*
   * =========================================================
   * REFS
   * =========================================================
   */

  const sectionRef =
    useRef(null);

  const headerRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const addressCardRef =
    useRef(null);


  /*
   * =========================================================
   * SHORT ENTRANCE ANIMATION
   * ---------------------------------------------------------
   * No pinned / scroll-heavy animation.
   * =========================================================
   */

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
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }


      if (mapRef.current) {
        gsap.fromTo(
          mapRef.current,
          {
            opacity: 0,
            y: 25,
            scale: 0.985,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            delay: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mapRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);


  /*
   * =========================================================
   * SUBTLE DESKTOP TILT
   * =========================================================
   */

  const handleMouseMove = (event) => {

    if (
      window.matchMedia(
        "(max-width: 767px)"
      ).matches
    ) {
      return;
    }

    const card =
      mapRef.current;

    if (!card) return;

    const rect =
      card.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    const centerX =
      rect.width / 2;

    const centerY =
      rect.height / 2;

    const rotateX =
      ((y - centerY) / centerY) * -1.5;

    const rotateY =
      ((x - centerX) / centerX) * 1.5;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.45,
      ease: "power2.out",
      transformPerspective: 1400,
      overwrite: true,
    });
  };


  const handleMouseLeave = () => {

    if (!mapRef.current) return;

    gsap.to(
      mapRef.current,
      {
        rotateX: 0,
        rotateY: 0,
        duration: 0.65,
        ease: "power3.out",
      }
    );
  };


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section
      ref={sectionRef}
      aria-labelledby="office-location-heading"
      className="
        relative
        w-full
        overflow-hidden
        border-t
        border-[#17213D]/[0.08]
        bg-[#EFEBE1]
        text-[#17213D]
        py-16
        sm:py-20
        lg:py-24
      "
    >

      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#C6A24A]/[0.035]
          blur-[110px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-40
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#17213D]/[0.02]
          blur-[110px]
        "
      />

      <div
        aria-hidden="true"
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
          CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-5
          sm:px-8
          md:px-12
        "
      >


        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          ref={headerRef}
          className="
            mb-9
            flex
            flex-col
            gap-6
            md:mb-11
            md:flex-row
            md:items-end
            md:justify-between
          "
        >

          {/* Left */}

          <div
            className="
              max-w-2xl
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
                border-[#C6A24A]/30
                bg-white
                px-3.5
                py-1.5
                text-[8px]
                font-bold
                uppercase
                tracking-[0.23em]
                text-[#C6A24A]
                shadow-sm
              "
            >

              <Sparkles
                size={11}
                className="text-[#C6A24A]"
              />

              {badge}

            </div>


            {/* Heading */}

            <h2
              id="office-location-heading"
              className="
                font-serif
                text-4xl
                font-normal
                leading-[1.05]
                tracking-[-0.04em]
                text-[#17213D]
                sm:text-5xl
                lg:text-6xl
              "
            >

              {titleMain}

              <span
                className="
                  ml-2
                  italic
                  font-light
                  text-[#C6A24A]
                "
              >
                {titleItalic}
              </span>

            </h2>


            {/* Description */}

            <p
              className="
                mt-4
                max-w-xl
                text-xs
                leading-6
                text-[#566078]
                sm:text-sm
              "
            >
              {description}
            </p>

          </div>


          {/* Maps CTA */}

          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${openMapsText} for ${officeName}`}
            className="
              group
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-3
              self-start
              rounded-full
              bg-[#17213D]
              px-6
              py-3.5
              text-[8px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-[#F7F5EF]
              shadow-[0_12px_30px_rgba(23,33,61,0.15)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#C6A24A]
              hover:text-[#0E162B]
              md:self-end
            "
          >

            <span>
              {openMapsText}
            </span>

            <ExternalLink
              size={13}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />

          </a>

        </div>


        {/* ===================================================
            LOCATION MAP
        =================================================== */}

        <div
          className="
            [perspective:1400px]
          "
        >

          <div
            ref={mapRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="
              group
              relative
              h-[460px]
              overflow-hidden
              rounded-[28px]
              border
              border-[#17213D]/10
              bg-white
              shadow-[0_25px_75px_rgba(23,33,61,0.08)]
              will-change-transform
              md:h-[520px]
            "
            style={{
              transformStyle:
                "preserve-3d",
            }}
          >

            {/* =================================================
                MAP
            ================================================= */}

            <iframe
              title={`${officeName} location in DLF Phase 2, Gurugram`}
              src={embedUrl}
              className="
                absolute
                inset-0
                h-full
                w-full
                border-0
                grayscale-[0.08]
                contrast-[1.02]
                saturate-[0.85]
              "
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />


            {/* =================================================
                MAP OVERLAY
            ================================================= */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-[#17213D]/25
                via-transparent
                to-transparent
              "
            />


            {/* =================================================
                FLOATING ADDRESS PANEL
            ================================================= */}

            <div
              ref={addressCardRef}
              className="
                absolute
                bottom-5
                left-5
                right-5
                z-10
                max-w-md
                rounded-[22px]
                border
                border-white/80
                bg-white/95
                p-5
                shadow-[0_20px_55px_rgba(23,33,61,0.12)]
                backdrop-blur-xl
                md:bottom-7
                md:left-7
                md:p-6
              "
              style={{
                transform:
                  "translateZ(35px)",
              }}
            >

              {/* Top */}

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div>

                  <div
                    className="
                      mb-2
                      inline-flex
                      items-center
                      gap-2
                      text-[#C6A24A]
                    "
                  >

                    <MapPin
                      size={14}
                      aria-hidden="true"
                    />

                    <span
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                      "
                    >
                      {officeBadge}
                    </span>

                  </div>


                  <h3
                    className="
                      font-serif
                      text-xl
                      font-normal
                      leading-tight
                      text-[#17213D]
                      sm:text-2xl
                    "
                    itemProp="name"
                  >
                    {officeName}
                  </h3>

                </div>


                {/* Location marker */}

                <div
                  className="
                    hidden
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C6A24A]/30
                    bg-[#F7F5EF]
                    text-[#C6A24A]
                    sm:flex
                  "
                >

                  <MapPin
                    size={17}
                  />

                </div>

              </div>


              {/* Address */}

              <address
                className="
                  mt-4
                  max-w-sm
                  not-italic
                  text-xs
                  leading-5
                  text-[#566078]
                "
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >

                <span
                  itemProp="streetAddress"
                >
                  {address}
                </span>

              </address>


              {/* Bottom */}

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-4
                  border-t
                  border-[#17213D]/[0.08]
                  pt-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                {/* GEO context */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                  "
                >

                  <span
                    className="
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#17213D]/40
                    "
                  >
                    DLF Phase 2
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />

                  <span
                    className="
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#17213D]/40
                    "
                  >
                    Gurugram
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />

                  <span
                    className="
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#17213D]/40
                    "
                  >
                    Haryana
                  </span>

                </div>


                {/* Directions */}

                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${directionsText} to ${officeName}`}
                  className="
                    group/directions
                    inline-flex
                    items-center
                    gap-2
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[#C6A24A]
                    transition-colors
                    hover:text-[#17213D]
                  "
                >

                  <span>
                    {directionsText}
                  </span>

                  <Navigation
                    size={12}
                    className="
                      transition-transform
                      duration-300
                      group-hover/directions:translate-x-0.5
                    "
                  />

                  <ArrowUpRight
                    size={11}
                    className="
                      transition-transform
                      duration-300
                      group-hover/directions:translate-x-0.5
                      group-hover/directions:-translate-y-0.5
                    "
                  />

                </a>

              </div>

            </div>




          </div>

        </div>


        {/* ===================================================
            BOTTOM LOCAL CONTEXT
        =================================================== */}

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
              text-[7px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#17213D]/30
            "
          >
            Luxury Real Estate
          </span>

          <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />

          <span
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#17213D]/30
            "
          >
            DLF Phase 2
          </span>

          <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />

          <span
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#17213D]/30
            "
          >
            Gurugram
          </span>

          <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />

          <span
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#17213D]/30
            "
          >
            Haryana
          </span>

        </div>

        {/* ===================================================
            ARCHITECTURAL BRIDGE: PHYSICAL OFFICE TO DIGITAL DESK
        =================================================== */}
        <div className="my-14 sm:my-18 flex items-center justify-center gap-4">
          <span className="h-px flex-1 max-w-[120px] bg-[#17213D]/15" />
          <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.25em] text-[#C6A24A]">
            <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />
            <span>HEADQUARTERS & MARKET INTELLIGENCE DESK</span>
            <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />
          </div>
          <span className="h-px flex-1 max-w-[120px] bg-[#17213D]/15" />
        </div>

        {/* ===================================================
            MERGED MARKET INTELLIGENCE & NEWSLETTER DESK
        =================================================== */}
        <NewsletterSection isEmbedded={true} />

      </div>

    </section>
  );
}