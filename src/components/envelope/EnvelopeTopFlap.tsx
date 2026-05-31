"use client";

import { forwardRef } from "react";

/**
 * EnvelopeTopFlap — the upper closing flap, rendered as an HTML div with
 * clip-path so CSS 3D transforms can hinge it around its top edge.
 * Lower seam points match EnvelopeBody's 130,150 and 270,150 points in
 * the 400×300 viewBox: 32.5%/50% and 67.5%/50%.
 */
export const EnvelopeTopFlap = forwardRef<HTMLDivElement>(
  function EnvelopeTopFlap(_props, ref) {
    return (
      <div
        ref={ref}
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
          clipPath: "polygon(0% 0%, 100% 0%, 67.5% 50%, 32.5% 50%)",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "visible",
          boxShadow:
            "inset 0 -10px 20px -12px rgba(61,43,24,0.30), inset 0 1px 0 rgba(255,255,255,0.48)",
        }}
        aria-hidden
      />
    );
  }
);
