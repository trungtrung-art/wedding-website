"use client";

/**
 * Option A — CSS 3D envelope demo.
 *
 * Same 5 paper pieces as the main hero, but the top triangle flap is
 * rendered as a SEPARATE element (an HTML div with clip-path polygon)
 * so we can hinge it in real 3D space. The remaining 4 pieces are
 * rendered as a flat SVG behind.
 *
 * The hinge uses CSS perspective + transform-style: preserve-3d on the
 * parent + GSAP rotateX on the flap. The flap stops at -158deg (not
 * -180deg) so the back of the flap angles toward the viewer the way a
 * real envelope flap hangs when opened.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export function EnvelopeDemoCss3D() {
  const [opened, setOpened] = useState(false);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);

  const open = () => {
    if (opened) return;
    const tl = gsap.timeline({ onComplete: () => setOpened(true) });

    // 1. Wax seal "breaks" first
    tl.to(sealRef.current, {
      scale: 0.5,
      rotate: 20,
      autoAlpha: 0,
      duration: 0.55,
      ease: "back.in(1.6)",
    });

    // 2. Top flap hinges back in 3D (rotateX around its top edge)
    tl.to(topFlapRef.current, {
      rotateX: -158,
      duration: 1.4,
      ease: "power3.inOut",
    }, "-=0.15");
  };

  const reset = () => {
    if (!opened) return;
    setOpened(false);
    gsap.set(topFlapRef.current, { rotateX: 0 });
    gsap.set(sealRef.current, { scale: 1, rotate: 0, autoAlpha: 1 });
  };

  return (
    <div
      className="relative"
      style={{ perspective: "1500px", perspectiveOrigin: "center top" }}
    >
      <button
        type="button"
        onClick={opened ? reset : open}
        aria-label={opened ? "Close envelope" : "Open envelope"}
        aria-expanded={opened}
        className="relative grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-600/50 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50"
        style={{
          width: "clamp(240px, 30vw, 360px)",
          aspectRatio: "3/4",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Body + left + right + bottom (4 of the 5 pieces) as flat SVG */}
        <svg
          viewBox="0 0 300 400"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="d-paper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8f2e5" />
              <stop offset="42%" stopColor="#eadfc9" />
              <stop offset="100%" stopColor="#d8c4a5" />
            </linearGradient>
            <linearGradient id="d-paper-warm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1e3cb" />
              <stop offset="54%" stopColor="#e2d0b2" />
              <stop offset="100%" stopColor="#ccb38e" />
            </linearGradient>
            <filter id="d-paper-surface" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.045 0.23" numOctaves="4" seed="17" result="fiberNoise" />
              <feColorMatrix
                in="fiberNoise"
                type="matrix"
                values="
                  0 0 0 0 0.55
                  0 0 0 0 0.47
                  0 0 0 0 0.34
                  0 0 0 0.18 0
                "
                result="fiberTint"
              />
              <feBlend in="SourceGraphic" in2="fiberTint" mode="multiply" result="fiberedPaper" />
              <feTurbulence type="turbulence" baseFrequency="0.018 0.075" numOctaves="2" seed="29" result="pressedRidges" />
              <feDisplacementMap in="fiberedPaper" in2="pressedRidges" scale="0.75" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="d-shadow" x="-10%" y="-5%" width="120%" height="115%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#2d2218" floodOpacity="0.22" />
            </filter>
          </defs>

          <g filter="url(#d-shadow)">
            {/* 1. Body rectangle */}
            <rect x="0" y="0" width="300" height="400" rx="3" fill="url(#d-paper)" filter="url(#d-paper-surface)" stroke="#b58552" strokeWidth="0.8" strokeOpacity="0.45" />
            {/* 2. Left triangle */}
            <polygon points="0,0 0,400 92,200" fill="url(#d-paper)" filter="url(#d-paper-surface)" stroke="#b58552" strokeWidth="0.6" strokeOpacity="0.5" />
            {/* 3. Right triangle */}
            <polygon points="300,0 300,400 208,200" fill="url(#d-paper)" filter="url(#d-paper-surface)" stroke="#b58552" strokeWidth="0.6" strokeOpacity="0.5" />
            {/* 4. Bottom trapezoid */}
            <polygon points="92,200 208,200 300,400 0,400" fill="url(#d-paper-warm)" filter="url(#d-paper-surface)" stroke="#b58552" strokeWidth="0.6" strokeOpacity="0.55" />
          </g>
        </svg>

        {/* 5. TOP TRIANGLE FLAP — rendered as HTML div with clip-path so
            CSS 3D transforms hinge it in real perspective space.
            transformOrigin: 'top' means the hinge axis is the top edge. */}
        <div
          ref={topFlapRef}
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            backgroundColor: "#e7d7bb",
            backgroundImage: [
              "linear-gradient(180deg, rgba(251,247,237,0.95) 0%, rgba(231,215,187,0.88) 58%, rgba(210,189,153,0.96) 100%)",
              "repeating-linear-gradient(104deg, rgba(255,255,255,0.24) 0 1px, transparent 1px 7px)",
              "repeating-linear-gradient(12deg, rgba(121,88,52,0.12) 0 1px, transparent 1px 11px)",
              "radial-gradient(circle at 22% 28%, rgba(255,255,255,0.30) 0 1px, transparent 2px)",
              "radial-gradient(circle at 72% 62%, rgba(111,78,44,0.16) 0 1px, transparent 2px)",
            ].join(", "),
            backgroundBlendMode: "normal, screen, multiply, screen, multiply",
            // Triangle: top-left, top-right, point at 50%/53% (matches the
            // SVG version's (150, 212) of 300x400 = 50%, 53%)
            clipPath: "polygon(0% 0%, 100% 0%, 50% 53%)",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "visible",
            // subtle inner shadow to show paper depth when rotated open
            boxShadow:
              "inset 0 -10px 20px -12px rgba(61,43,24,0.30), inset 0 1px 0 rgba(255,255,255,0.48)",
          }}
        />

        {/* T&T wax seal sits at the meeting point of all flaps */}
        <span
          ref={sealRef}
          className="pointer-events-none absolute z-40 h-24 w-24 md:h-28 md:w-28"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          aria-hidden
        >
          <Image
            src="/wedding-assets/seal-tt.svg"
            alt=""
            width={400}
            height={400}
            className="h-full w-full"
          />
        </span>
      </button>

      <p className="mt-8 text-center text-xs uppercase tracking-[0.32em] text-burgundy-900/70">
        {opened ? "click to reset" : "click envelope to open"}
      </p>
    </div>
  );
}
