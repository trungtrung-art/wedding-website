"use client";

import { forwardRef } from "react";
import Image from "next/image";

/**
 * EnvelopeSeal — the image-based gold wax seal that sits at the V meeting point
 * (50% / 50% of the envelope stage).
 */
export const EnvelopeSeal = forwardRef<HTMLSpanElement, { src?: string }>(
  function EnvelopeSeal({ src = "/wedding-assets/golden-heart-wax-seal.png" }, ref) {
    return (
      <span
        ref={ref}
        className="pointer-events-none absolute z-50 h-24 w-24 md:h-28 md:w-28"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        aria-hidden
      >
        <Image src={src} alt="" width={400} height={400} className="h-full w-full" />
      </span>
    );
  }
);
