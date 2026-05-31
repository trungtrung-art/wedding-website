"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Leaf } from "lucide-react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { MusicToggle } from "@/components/music-toggle";

/**
 * EnvelopeSvg — closed-state envelope built from 5 distinct paper pieces.
 *
 * Layering (back → front in SVG paint order):
 *   1. Body rectangle — the full envelope silhouette / paper backing
 *   2. Left triangle  — flap folded inward from the left edge
 *   3. Right triangle — mirror of left
 *   4. Bottom trapezoid — flap folded UP from the bottom edge
 *   5. Top triangle — closing flap (point reaches just past center); will
 *      animate up/back when the envelope opens.
 *
 * ViewBox 400×300 matches the parent button's 4:3 LANDSCAPE aspect ratio
 * (wider than tall, like a real wedding invitation envelope — C5/C6/DL
 * formats are all landscape). The closed envelope reads as a perfect
 * rectangle with no rounded corners. The 4 flaps meet at point
 * (200, 150) which is 50%/50% of the container — that's where the
 * T&Q wax seal sits.
 */
function EnvelopeSvg({
  bodyRef,
  leftFlapRef,
  rightFlapRef,
  bottomFlapRef,
}: {
  bodyRef: RefObject<SVGRectElement | null>;
  leftFlapRef: RefObject<SVGPolygonElement | null>;
  rightFlapRef: RefObject<SVGPolygonElement | null>;
  bottomFlapRef: RefObject<SVGPolygonElement | null>;
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        {/* Cream paper gradient — subtle top-to-bottom for natural depth */}
        <linearGradient id="env-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfaf3" />
          <stop offset="100%" stopColor="#efe2cd" />
        </linearGradient>

        {/* Slightly warmer cream for the bottom trapezoid so it reads as a
            separate piece behind the others */}
        <linearGradient id="env-paper-warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e9d4" />
          <stop offset="100%" stopColor="#e8d9bf" />
        </linearGradient>

        {/* Slightly cooler cream for the top flap so its fold edge is visible */}
        <linearGradient id="env-paper-cool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fefcf6" />
          <stop offset="100%" stopColor="#f4e7d0" />
        </linearGradient>

        {/* Soft drop shadow under the whole envelope */}
        <filter id="env-shadow" x="-10%" y="-5%" width="120%" height="115%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#2d2218" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#env-shadow)">
        {/* 1. Body rectangle — full silhouette, base layer.
              No rx → sharp corners → reads as a perfect rectangle. */}
        <rect
          ref={bodyRef}
          x="0"
          y="0"
          width="400"
          height="300"
          fill="url(#env-paper)"
          stroke="#b58552"
          strokeWidth="0.8"
          strokeOpacity="0.45"
        />

        {/* 2. Left triangle flap (folded inward; point at center-left) */}
        <polygon
          ref={leftFlapRef}
          points="0,0 0,300 130,150"
          fill="url(#env-paper)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        {/* 3. Right triangle flap (mirror) */}
        <polygon
          ref={rightFlapRef}
          points="400,0 400,300 270,150"
          fill="url(#env-paper)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        {/* 4. Bottom trapezoid (folded up; parallel top/bottom edges) */}
        <polygon
          ref={bottomFlapRef}
          points="130,150 270,150 400,300 0,300"
          fill="url(#env-paper-warm)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.55"
        />

        {/* Top triangle flap is rendered OUTSIDE this SVG as an HTML div
            (clip-path triangle) so CSS 3D transforms can hinge it in real
            perspective space. See the topFlap div in the Hero JSX below. */}
      </g>
    </svg>
  );
}

export function Hero() {
  const t = useT();
  const [opened, setOpened] = useState(false);

  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLButtonElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  // Envelope: 4 stable pieces stay put as the "pocket", top flap hinges in 3D
  const envBodyRef = useRef<SVGRectElement>(null);
  const envLeftFlapRef = useRef<SVGPolygonElement>(null);
  const envRightFlapRef = useRef<SVGPolygonElement>(null);
  const envBottomFlapRef = useRef<SVGPolygonElement>(null);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);
  const sheet1Ref = useRef<HTMLDivElement>(null);
  const sheet2Ref = useRef<HTMLDivElement>(null);
  const sheet3Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leftSprigRef = useRef<HTMLSpanElement>(null);
  const rightSprigRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Initial states + reduced-motion handling
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set([sheet1Ref.current, sheet2Ref.current, sheet3Ref.current, cardRef.current, leftSprigRef.current, rightSprigRef.current, hintRef.current], {
        autoAlpha: 1, x: 0, y: 0, rotate: 0,
      });
      gsap.set([sealRef.current], { autoAlpha: 0 });
      gsap.set(topFlapRef.current, { rotateX: -158 });
      setOpened(true);
      return;
    }

    gsap.set([sheet1Ref.current, sheet3Ref.current], { autoAlpha: 0, y: 60, scale: 0.95 });
    gsap.set(sheet2Ref.current, { autoAlpha: 0, y: 80, scale: 0.95 });
    gsap.set(cardRef.current, { autoAlpha: 0, y: 100, rotate: -3 });
    gsap.set(leftSprigRef.current, { autoAlpha: 0, x: 50, y: 30, rotate: -28 });
    gsap.set(rightSprigRef.current, { autoAlpha: 0, x: -50, y: 30, rotate: 28 });
    gsap.set(hintRef.current, { autoAlpha: 0, y: 18 });
    gsap.set(topFlapRef.current, { rotateX: 0 });
  }, []);

  // Scroll-driven fade on the envelope as you leave the hero
  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(shellRef.current, {
        y: -80, opacity: 0.45, ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const open = () => {
    if (opened) {
      document.getElementById("date-banner")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => setOpened(true),
    });

    tl
      // 1. Envelope rises slightly — anticipation
      .to(shellRef.current, { y: -14, scale: 1.025, duration: 0.5 })
      // 2. Wax seal "breaks" — scales down, rotates, fades
      .to(sealRef.current, {
        scale: 0.55, rotate: 22, autoAlpha: 0,
        duration: 0.55, ease: "back.in(1.6)",
      }, "-=0.1")
      // 3. Top triangle flap HINGES back in real 3D space (CSS perspective +
      //    transformStyle: preserve-3d on the button parent). The 4 stable
      //    pieces (body + L/R triangles + bottom trapezoid) stay put as
      //    the visible envelope pocket.
      .to(topFlapRef.current, {
        rotateX: -158, duration: 1.2, ease: "power3.inOut",
      }, "-=0.4")
      // 4. THREE photo sheets fan out from inside the envelope
      .to(sheet1Ref.current, {
        autoAlpha: 1, y: -38, x: -42, rotate: -9, scale: 1, duration: 0.95,
      }, "-=0.4")
      .to(sheet3Ref.current, {
        autoAlpha: 1, y: -38, x: 42, rotate: 9, scale: 1, duration: 0.95,
      }, "<")
      .to(sheet2Ref.current, {
        autoAlpha: 1, y: -56, scale: 1, duration: 0.95,
      }, "<+0.08")
      // 6. Main SAVE THE DATE card rises out of the envelope (-160px) with
      //    a slight clockwise tilt (rotate: 6deg) so it lands at a casual
      //    angle — top edge tilts right, bottom edge tilts left, like a
      //    card tossed onto the table rather than perfectly squared.
      .to(cardRef.current, {
        autoAlpha: 1, y: -160, rotate: 6, duration: 1.2, ease: "power3.out",
      }, "<+0.2")
      // 7. Floral sprigs glide in from corners
      .to([leftSprigRef.current, rightSprigRef.current], {
        autoAlpha: 1, x: 0, y: 0, rotate: 0, stagger: 0.12, duration: 0.85,
      }, "-=0.7")
      // 8. (Intro names stay put — moving them clips them at the top
      //     of the viewport in tighter window sizes.)
      // 9. Scroll hint reveals at bottom
      .to(hintRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");
  };

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto flex min-h-screen max-w-screen-2xl flex-col items-center justify-between gap-8 px-6 py-8 text-center md:py-14"
    >
      {/* Intro: couple names */}
      <div ref={introRef} className="w-full space-y-5">
        <p className="text-xs font-medium uppercase tracking-[0.42em] text-burgundy-900/70">
          {t("hero.kicker")}
        </p>
        {/* Stepped layout with a precise meeting point: 2-column grid
            where the GROOM sits in column 1 right-aligned (so its last
            letter touches the column boundary at 50%) and the BRIDE sits
            in column 2 left-aligned (so its first letter starts at the
            same boundary). The "&" spans both columns text-centered, so
            it lands exactly on that 50% line. End of "Trung", the "&",
            and start of "Quỳnh" all align vertically at the middle. */}
        {/* Grid with auto-sized columns: each name's column is exactly as
            wide as the name's text (no 50/50 split that clips). The two
            columns share a boundary in the middle — that's where the
            "g" of Trung ends and the "Q" of Quỳnh starts. The ampersand
            col-spans both and text-centers, landing on that boundary. */}
        {/* Sizes calibrated to fit BOTH names side-by-side in each breakpoint's
            viewport: ~11-char names (Thiện Trung / Quỳnh Trang) at the font
            size need 2 × (chars × ~0.6 × font-size) ≤ viewport - padding.
            Capped at text-[7rem] on 2xl+ screens where it actually fits. */}
        <div className="grid w-full grid-cols-[max-content_max-content] items-baseline justify-center gap-y-2">
          <h1 className="couple-name col-start-1 col-end-2 whitespace-nowrap pr-3 text-right text-4xl leading-[0.95] text-burgundy-900 sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {invitation.couple.groom.name}
          </h1>
          <p className="couple-connector col-span-2 col-start-1 text-center text-3xl leading-none text-bronze-500 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            &amp;
          </p>
          <h2 className="couple-name col-start-2 col-end-3 whitespace-nowrap pl-3 text-left text-4xl leading-[0.95] text-burgundy-900 sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {invitation.couple.bride.name}
          </h2>
        </div>
      </div>

      {/* Envelope stage */}
      <button
        ref={shellRef}
        type="button"
        aria-label={opened ? t("hero.scrollHint") : t("hero.tagline")}
        aria-expanded={opened}
        onClick={open}
        className="group relative grid place-items-center transition-transform duration-300 ease-out hover:scale-[1.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-600/50 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50"
        style={{
          width: "clamp(440px, 55vw, 720px)",
          aspectRatio: "4/3",
          perspective: "2200px",
          perspectiveOrigin: "center top",
          transformStyle: "preserve-3d",
        }}
      >

        {/* Left photo sheet (gallery[0]) — fans out to the left */}
        <div
          ref={sheet1Ref}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute left-[6%] top-[18%] z-40 aspect-square w-[42%] origin-bottom overflow-hidden p-1.5"
        >
          <Image
            src={invitation.photos.gallery[0]}
            alt="Wedding moment 1"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right photo sheet (gallery[2]) — fans out to the right */}
        <div
          ref={sheet3Ref}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute right-[6%] top-[18%] z-40 aspect-square w-[42%] origin-bottom overflow-hidden p-1.5"
        >
          <Image
            src={invitation.photos.gallery[2]}
            alt="Wedding moment 3"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Center photo sheet (gallery[1]) — peeks slightly higher than the two side sheets */}
        <div
          ref={sheet2Ref}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute left-1/2 top-[13%] z-[45] aspect-square w-[50%] -translate-x-1/2 origin-bottom overflow-hidden p-1.5"
        >
          <Image
            src={invitation.photos.gallery[1]}
            alt="Wedding moment 2"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Main SAVE THE DATE card — top layer */}
        {/* Card sits BEHIND the photos (z-[35] vs z-40/z-[45]) and rises
            out of the envelope on open (y: -110 in the animation timeline)
            so the T&Q / SAVE / DATE text ends up ABOVE the photos.
            The lower portion of the card stays inside the envelope
            pocket, hidden behind the photo sheets. */}
        <div
          ref={cardRef}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute left-1/2 top-[5%] z-[35] flex aspect-square w-[64%] -translate-x-1/2 flex-col items-center justify-start bg-cream-50 px-4 pt-6"
        >
          <span className="text-[0.7rem] uppercase tracking-[0.42em] text-burgundy-900/60">
            {invitation.couple.initials}
          </span>
          <span className="mt-2 font-serif text-3xl font-light uppercase leading-none text-burgundy-900 md:text-4xl">
            {t("hero.saveTheDateLine1")}
          </span>
          <span className="mt-1 font-serif text-3xl font-light uppercase leading-none text-burgundy-900 md:text-4xl">
            {t("hero.saveTheDateLine2")}
          </span>
          
        </div>

        {/* Envelope pocket — 4 stable pieces as flat SVG (body + L/R
            triangles + bottom trapezoid). These never move; they form
            the visible envelope from which the card emerges. */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <EnvelopeSvg
            bodyRef={envBodyRef}
            leftFlapRef={envLeftFlapRef}
            rightFlapRef={envRightFlapRef}
            bottomFlapRef={envBottomFlapRef}
          />
        </div>

        {/* Top triangle FLAP — separate HTML div with clip-path so CSS 3D
            transforms can hinge it back around its top edge. Point at
            50%/50% matches the SVG meeting point (200, 150) of 400×300. */}
        <div
          ref={topFlapRef}
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background: "linear-gradient(to bottom, #fefcf6, #f4e7d0)",
            clipPath: "polygon(0% 0%, 100% 0%, 50% 50%)",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "visible",
            boxShadow: "inset 0 -8px 18px -10px rgba(45,34,24,0.18)",
          }}
          aria-hidden
        />

        {/* Our burgundy T&Q wax seal — overlays the gold seal painted into
            the PNG (centered horizontally; ~58% from top is where the V flap
            meets the body, matching the PNG's existing seal position). */}
        <span
          ref={sealRef}
          className="pointer-events-none absolute z-40 h-24 w-24 md:h-28 md:w-28"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          aria-hidden
        >
          <Image
            src="/wedding-assets/seal-tq.svg"
            alt=""
            width={400}
            height={400}
            className="h-full w-full"
          />
        </span>

        {/* Floral sprigs */}
        <span
          ref={leftSprigRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute -left-6 bottom-[28%] z-50 h-16 w-16 text-bronze-500/85"
          aria-hidden
        >
          <Leaf
            className="h-full w-full"
            strokeWidth={1.1}
            style={{ transform: "rotate(-30deg)" }}
          />
        </span>
        <span
          ref={rightSprigRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute -right-6 bottom-[28%] z-50 h-16 w-16 text-bronze-500/85"
          aria-hidden
        >
          <Leaf
            className="h-full w-full"
            strokeWidth={1.1}
            style={{ transform: "rotate(30deg) scaleX(-1)" }}
          />
        </span>

        {/* Status text */}
        <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.34em] text-burgundy-900/75">
          {opened ? t("hero.scrollHint") : t("hero.tagline")}
        </span>
      </button>

      {/* Music toggle + scroll hint */}
      <div ref={hintRef} style={{ opacity: 0 }} className="flex flex-col items-center gap-5">
        <MusicToggle />
        <ChevronDown
          className="h-8 w-8 animate-bounce text-burgundy-900/60"
          strokeWidth={1.4}
        />
      </div>
    </section>
  );
}
