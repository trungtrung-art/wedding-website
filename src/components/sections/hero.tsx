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
 * ViewBox 300×400 matches the parent button's 3:4 aspect ratio exactly so
 * the SVG fills the container with no letterboxing. The 4 flaps meet at
 * point (150, 200) which is 50%/50% of the container — that's where the
 * T&Q wax seal sits.
 */
function EnvelopeSvg({
  bodyRef,
  leftFlapRef,
  rightFlapRef,
  bottomFlapRef,
  topFlapRef,
}: {
  bodyRef: RefObject<SVGRectElement | null>;
  leftFlapRef: RefObject<SVGPolygonElement | null>;
  rightFlapRef: RefObject<SVGPolygonElement | null>;
  bottomFlapRef: RefObject<SVGPolygonElement | null>;
  topFlapRef: RefObject<SVGPolygonElement | null>;
}) {
  return (
    <svg
      viewBox="0 0 300 400"
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
        {/* 1. Body rectangle — full silhouette, base layer */}
        <rect
          ref={bodyRef}
          x="0"
          y="0"
          width="300"
          height="400"
          rx="3"
          fill="url(#env-paper)"
          stroke="#b58552"
          strokeWidth="0.8"
          strokeOpacity="0.45"
        />

        {/* 2. Left triangle flap (folded inward; point at center-left) */}
        <polygon
          ref={leftFlapRef}
          points="0,0 0,400 92,200"
          fill="url(#env-paper)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        {/* 3. Right triangle flap (mirror) */}
        <polygon
          ref={rightFlapRef}
          points="300,0 300,400 208,200"
          fill="url(#env-paper)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        {/* 4. Bottom trapezoid (folded up; parallel top/bottom edges) */}
        <polygon
          ref={bottomFlapRef}
          points="92,200 208,200 300,400 0,400"
          fill="url(#env-paper-warm)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.55"
        />

        {/* 5. Top triangle flap (closing flap; point just past center so it
              visibly sits on TOP of the meeting point — that's where the
              seal goes). Will animate up/back when envelope opens. */}
        <polygon
          ref={topFlapRef}
          points="0,0 300,0 150,212"
          fill="url(#env-paper-cool)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.55"
          style={{ transformOrigin: "150px 0px", transformBox: "fill-box" }}
        />
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
  const closedRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  // 5 pieces of the closed-state SVG envelope (for future per-piece animation)
  const envBodyRef = useRef<SVGRectElement>(null);
  const envLeftFlapRef = useRef<SVGPolygonElement>(null);
  const envRightFlapRef = useRef<SVGPolygonElement>(null);
  const envBottomFlapRef = useRef<SVGPolygonElement>(null);
  const envTopFlapRef = useRef<SVGPolygonElement>(null);
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
      gsap.set([backRef.current, sheet1Ref.current, sheet2Ref.current, sheet3Ref.current, cardRef.current, leftSprigRef.current, rightSprigRef.current, hintRef.current], {
        autoAlpha: 1, x: 0, y: 0, rotate: 0,
      });
      gsap.set([closedRef.current, sealRef.current], { autoAlpha: 0 });
      setOpened(true);
      return;
    }

    gsap.set(backRef.current, { autoAlpha: 0 });
    gsap.set([sheet1Ref.current, sheet3Ref.current], { autoAlpha: 0, y: 60, scale: 0.95 });
    gsap.set(sheet2Ref.current, { autoAlpha: 0, y: 80, scale: 0.95 });
    gsap.set(cardRef.current, { autoAlpha: 0, y: 100, rotate: -3 });
    gsap.set(leftSprigRef.current, { autoAlpha: 0, x: 50, y: 30, rotate: -28 });
    gsap.set(rightSprigRef.current, { autoAlpha: 0, x: -50, y: 30, rotate: 28 });
    gsap.set(hintRef.current, { autoAlpha: 0, y: 18 });
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
      // 3. Closed envelope graphic cross-fades out (the PNG includes its
      //    own flap; we don't need a separate flap-peel animation now)
      .to(closedRef.current, {
        autoAlpha: 0, scale: 1.05, duration: 0.85, ease: "power2.inOut",
      }, "-=0.35")
      // 4. Inner back wall fades in (envelope is now open)
      .to(backRef.current, { autoAlpha: 1, duration: 0.5 }, "-=0.6")
      // 5. THREE photo sheets fan out from inside the envelope
      .to(sheet1Ref.current, {
        autoAlpha: 1, y: -38, x: -42, rotate: -9, scale: 1, duration: 0.95,
      }, "-=0.4")
      .to(sheet3Ref.current, {
        autoAlpha: 1, y: -38, x: 42, rotate: 9, scale: 1, duration: 0.95,
      }, "<")
      .to(sheet2Ref.current, {
        autoAlpha: 1, y: -56, scale: 1, duration: 0.95,
      }, "<+0.08")
      // 6. Main SAVE THE DATE card slides up on top
      .to(cardRef.current, {
        autoAlpha: 1, y: -78, rotate: 0, duration: 1.1, ease: "power3.out",
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
      className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-between gap-6 px-5 py-6 text-center md:py-10"
    >
      {/* Intro: couple names */}
      <div ref={introRef} className="space-y-5">
        <p className="text-xs font-medium uppercase tracking-[0.42em] text-burgundy-900/70">
          {t("hero.kicker")}
        </p>
        <div className="space-y-1">
          <h1 className="couple-name text-7xl leading-none text-burgundy-900 md:text-9xl">
            {invitation.couple.groom.name}
          </h1>
          <p className="couple-connector text-6xl leading-none text-bronze-500 md:text-8xl">&amp;</p>
          <h2 className="couple-name text-7xl leading-none text-burgundy-900 md:text-9xl">
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
        style={{ width: "clamp(220px, 28vw, 320px)", aspectRatio: "3/4" }}
      >
        {/* Inner-back wall of envelope (revealed when opened) */}
        <Image
          ref={backRef}
          src="/wedding-assets/layer-envelope-back.png"
          alt=""
          width={694}
          height={799}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain"
          style={{ opacity: 0 }}
          aria-hidden
        />

        {/* Left photo sheet (gallery[0]) — fans out to the left */}
        <div
          ref={sheet1Ref}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute left-[6%] top-[18%] z-30 aspect-square w-[42%] origin-bottom overflow-hidden p-1.5"
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
          className="paper-panel pointer-events-none absolute right-[6%] top-[18%] z-30 aspect-square w-[42%] origin-bottom overflow-hidden p-1.5"
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
          className="paper-panel pointer-events-none absolute left-1/2 top-[13%] z-40 aspect-square w-[50%] -translate-x-1/2 origin-bottom overflow-hidden p-1.5"
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
        <div
          ref={cardRef}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute left-1/2 top-[16%] z-50 flex aspect-[3/4] w-[60%] -translate-x-1/2 flex-col items-center justify-center bg-cream-50 px-3 py-4"
        >
          <span className="text-[0.55rem] uppercase tracking-[0.42em] text-burgundy-900/60">
            {invitation.couple.initials}
          </span>
          <span className="mt-1 font-serif text-2xl font-light uppercase leading-none text-burgundy-900">
            {t("hero.saveTheDateLine1")}
          </span>
          <span className="mt-0.5 font-serif text-2xl font-light uppercase leading-none text-burgundy-900">
            {t("hero.saveTheDateLine2")}
          </span>
          <div className="mt-2 h-[42%] w-full overflow-hidden">
            <Image
              src={invitation.photos.hero}
              alt=""
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="mt-2 text-[0.55rem] uppercase tracking-[0.28em] text-burgundy-900/70">
            {invitation.ceremony.solarDate}
          </span>
        </div>

        {/* Closed-envelope — 5 SVG pieces (body rectangle + left triangle +
            right triangle + bottom trapezoid + top triangle). Each piece
            has its own ref so future iterations can animate them
            independently (e.g. top flap rotating open). */}
        <div
          ref={closedRef}
          className="pointer-events-none absolute inset-0 z-20"
        >
          <EnvelopeSvg
            bodyRef={envBodyRef}
            leftFlapRef={envLeftFlapRef}
            rightFlapRef={envRightFlapRef}
            bottomFlapRef={envBottomFlapRef}
            topFlapRef={envTopFlapRef}
          />
        </div>

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
