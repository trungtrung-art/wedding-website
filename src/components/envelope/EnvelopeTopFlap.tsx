"use client";

import { forwardRef } from "react";

/**
 * EnvelopeTopFlap — the upper closing flap, rendered as an HTML div with
 * clip-path so CSS 3D transforms can hinge it around its top edge.
 * It uses the traditional triangular envelope shape: full-width top edge
 * folding down to a centered point.
 */
export const EnvelopeTopFlap = forwardRef<HTMLDivElement>(
  function EnvelopeTopFlap(_props, ref) {
    return (
      <div
        ref={ref}
        className="pointer-events-none absolute inset-0 z-40"
        style={{
          backgroundImage: "url('/wedding-assets/kaleidoscope-bordeaux.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          clipPath: "polygon(0% 0%, 100% 0%, 50% 56%)",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
        aria-hidden
      />
    );
  }
);
