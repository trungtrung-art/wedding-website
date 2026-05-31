"use client";

import type { RefObject } from "react";

/**
 * EnvelopeBody — closed-state envelope built from 4 SVG paper pieces.
 *
 * Layering (back → front in SVG paint order):
 *   1. Body rectangle — the full envelope silhouette / paper backing
 *   2. Left triangle  — flap folded inward from the left edge
 *   3. Right triangle — mirror of left
 *   4. Bottom trapezoid — flap folded UP from the bottom edge
 *
 * The top closing flap is rendered separately as an HTML div
 * (see EnvelopeTopFlap) so CSS 3D transforms can hinge it.
 *
 * ViewBox 400×300 (landscape 4:3). Left/right/bottom folds meet along
 * the center seam from 130,150 to 270,150; the wax seal sits at center.
 */
export function EnvelopeBody({
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
        <linearGradient id="env-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8f2e5" />
          <stop offset="42%" stopColor="#eadfc9" />
          <stop offset="100%" stopColor="#d8c4a5" />
        </linearGradient>

        <linearGradient id="env-paper-warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1e3cb" />
          <stop offset="54%" stopColor="#e2d0b2" />
          <stop offset="100%" stopColor="#ccb38e" />
        </linearGradient>

        <linearGradient id="env-paper-cool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf7ed" />
          <stop offset="100%" stopColor="#e7d7bb" />
        </linearGradient>

        <filter
          id="env-paper-surface"
          x="-2%"
          y="-2%"
          width="104%"
          height="104%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.045 0.23"
            numOctaves="4"
            seed="17"
            result="fiberNoise"
          />
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
          <feBlend
            in="SourceGraphic"
            in2="fiberTint"
            mode="multiply"
            result="fiberedPaper"
          />
          <feTurbulence
            type="turbulence"
            baseFrequency="0.018 0.075"
            numOctaves="2"
            seed="29"
            result="pressedRidges"
          />
          <feDisplacementMap
            in="fiberedPaper"
            in2="pressedRidges"
            scale="0.75"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="env-shadow" x="-10%" y="-5%" width="120%" height="115%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="12"
            floodColor="#2d2218"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      <g filter="url(#env-shadow)">
        <rect
          ref={bodyRef}
          x="0"
          y="0"
          width="400"
          height="300"
          rx="1.5"
          fill="url(#env-paper-cool)"
          filter="url(#env-paper-surface)"
          stroke="#a77a4d"
          strokeWidth="0.6"
          strokeOpacity="0.28"
        />

        <polygon
          ref={leftFlapRef}
          points="0,0 0,300 130,150"
          fill="url(#env-paper)"
          filter="url(#env-paper-surface)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        <polygon
          ref={rightFlapRef}
          points="400,0 400,300 270,150"
          fill="url(#env-paper)"
          filter="url(#env-paper-surface)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        <polygon
          ref={bottomFlapRef}
          points="130,150 270,150 400,300 0,300"
          fill="url(#env-paper-warm)"
          filter="url(#env-paper-surface)"
          stroke="#b58552"
          strokeWidth="0.6"
          strokeOpacity="0.55"
        />
      </g>
    </svg>
  );
}
