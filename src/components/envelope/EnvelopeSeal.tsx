"use client";

import { forwardRef } from "react";
import Image from "next/image";

/**
 * EnvelopeSeal — the burgundy wax seal that sits at the V meeting point
 * (50% / 50% of the envelope stage).
 */
export const EnvelopeSeal = forwardRef<HTMLSpanElement, { src?: string }>(
  function EnvelopeSeal({ src = "/wedding-assets/seal-tq.svg" }, ref) {
    return (
      <span
        ref={ref}
        className="pointer-events-none absolute z-40 h-24 w-24 md:h-28 md:w-28"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        aria-hidden
      >
        <Image src={src} alt="" width={400} height={400} className="h-full w-full" />
      </span>
    );
  }
);
