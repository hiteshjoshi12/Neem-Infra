import { useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCms } from "../../context/CmsContext";

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
        border-[#182345]/[0.06]
        bg-[#F9F7F4]
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
          bg-[#D09A16]/[0.035]
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
          bg-[#182345]/[0.018]
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
          [background-image:linear-gradient(to_right,#182345_1px,transparent_1px),linear-gradient(to_bottom,#182345_1px,transparent_1px)]
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
          max-w-6xl
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
                text-[#182345]
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
                  text-[#D09A16]
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
                text-[#5D667D]
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
              bg-[#182345]
              px-6
              py-3.5
              text-[8px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-white
              shadow-[0_12px_30px_rgba(24,35,69,0.15)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#D09A16]
              hover:text-[#182345]
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
              border-[#182345]/10
              bg-white
              shadow-[0_25px_75px_rgba(24,35,69,0.10)]
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
                from-[#182345]/20
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
                border-white/70
                bg-white/95
                p-5
                shadow-[0_20px_55px_rgba(24,35,69,0.16)]
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
                      text-[#A87505]
                    "
                  >

                    <MapPin
                      size={14}
                      aria-hidden="true"
                    />

                    <span
                      className="
                        text-[7px]
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
                      text-[#182345]
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
                    border-[#D09A16]/25
                    bg-[#D09A16]/[0.06]
                    text-[#D09A16]
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
                  text-[10px]
                  leading-5
                  text-[#5D667D]
                  sm:text-xs
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
                  border-[#182345]/[0.07]
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
                      text-[6px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#182345]/30
                    "
                  >
                    DLF Phase 2
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

                  <span
                    className="
                      text-[6px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#182345]/30
                    "
                  >
                    Gurugram
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

                  <span
                    className="
                      text-[6px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#182345]/30
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
                    text-[#A87505]
                    transition-colors
                    hover:text-[#182345]
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
            mt-7
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
              tracking-[0.2em]
              text-[#182345]/25
            "
          >
            Luxury Real Estate
          </span>

          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

          <span
            className="
              text-[6px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#182345]/25
            "
          >
            DLF Phase 2
          </span>

          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

          <span
            className="
              text-[6px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#182345]/25
            "
          >
            Gurugram
          </span>

          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />

          <span
            className="
              text-[6px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#182345]/25
            "
          >
            Haryana
          </span>

        </div>

      </div>

    </section>
  );
}