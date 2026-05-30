"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { useParallax } from "@/lib/use-parallax";

export function QuoteThreeThings() {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef, { childSelector: "[data-reveal]", stagger: 0.25 });
  useParallax(bgRef, 0.4);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-burgundy-900 py-32 text-center text-cream-50">
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(184, 133, 82, 0.18), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl space-y-6 px-5">
        <p data-reveal className="whitespace-pre-line font-serif text-3xl italic leading-snug md:text-5xl">
          {t("quoteThreeThings.vi")}
        </p>
        <p data-reveal className="whitespace-pre-line text-sm italic text-cream-100/80 md:text-base">
          {t("quoteThreeThings.en")}
        </p>
      </div>
    </section>
  );
}
