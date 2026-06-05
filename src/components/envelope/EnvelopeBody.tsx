"use client";

import type { RefObject } from "react";

/**
 * EnvelopeBody — envelope pocket built from SVG paper pieces.
 *
 * Layering (back → front when variant="full"):
 *   1. Body rectangle — the full envelope silhouette / paper backing
 *   2. Left triangle  — flap folded inward from the left edge
 *   3. Right triangle — mirror of left
 *   4. Bottom trapezoid — flap folded UP from the bottom edge
 *
 * In the hero, the body is rendered twice: variant="back" below the cards
 * and variant="front" above them. That lets the front flaps mask the lower
 * portions of photos/cards as they rise from inside the envelope.
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
  idPrefix = "env",
  variant = "full",
}: {
  bodyRef: RefObject<SVGRectElement | null>;
  leftFlapRef: RefObject<SVGPolygonElement | null>;
  rightFlapRef: RefObject<SVGPolygonElement | null>;
  bottomFlapRef: RefObject<SVGPolygonElement | null>;
  idPrefix?: string;
  variant?: "back" | "front" | "full";
}) {
  const bordeauxPatternId = `${idPrefix}-bordeaux-pattern`;
  const shadowId = `${idPrefix}-shadow`;
  const rimShadowId = `${idPrefix}-rim-shadow`;
  const clipId = `${idPrefix}-rounded-clip`;
  const showBack = variant === "back" || variant === "full";
  const showFront = variant === "front" || variant === "full";

  return (
    <svg
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <pattern
          id={bordeauxPatternId}
          patternUnits="userSpaceOnUse"
          width="400"
          height="300"
        >
          <image
            href="/wedding-assets/kaleidoscope-bordeaux.jpg"
            x="0"
            y="0"
            width="400"
            height="300"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>

        <filter id={shadowId} x="-10%" y="-5%" width="120%" height="115%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="12"
            floodColor="#2d2218"
            floodOpacity="0.22"
          />
        </filter>

        <filter id={rimShadowId} x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2.2"
            floodColor="#4b3320"
            floodOpacity="0.26"
          />
        </filter>

        <clipPath id={clipId}>
          <rect x="0" y="0" width="400" height="300" rx="5" ry="5" />
        </clipPath>
      </defs>

      <g filter={`url(#${shadowId})`}>
        <g clipPath={`url(#${clipId})`}>
          {showBack && (
            <rect
              ref={bodyRef}
              x="0"
              y="0"
              width="400"
              height="300"
              rx="5"
              ry="5"
              fill={`url(#${bordeauxPatternId})`}
              stroke="#a77a4d"
              strokeWidth="0.6"
              strokeOpacity="0.28"
            />
          )}

          {showFront && (
            <>
              <polygon
                ref={leftFlapRef}
                points="0,0 0,300 130,150"
                fill={`url(#${bordeauxPatternId})`}
                stroke="#b58552"
                strokeWidth="0.6"
                strokeOpacity="0.5"
              />

              <polygon
                ref={rightFlapRef}
                points="400,0 400,300 270,150"
                fill={`url(#${bordeauxPatternId})`}
                stroke="#b58552"
                strokeWidth="0.6"
                strokeOpacity="0.5"
              />

              <polygon
                ref={bottomFlapRef}
                points="130,150 270,150 400,300 0,300"
                fill={`url(#${bordeauxPatternId})`}
                stroke="#b58552"
                strokeWidth="0.6"
                strokeOpacity="0.55"
              />

              <path
                d="M0 0 L130 150 L270 150 L400 0"
                fill="none"
                stroke="#7b5535"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.34"
                filter={`url(#${rimShadowId})`}
              />

              <path
                d="M130 150 L270 150"
                fill="none"
                stroke="#fff6e4"
                strokeWidth="1"
                strokeLinecap="round"
                strokeOpacity="0.35"
              />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}
