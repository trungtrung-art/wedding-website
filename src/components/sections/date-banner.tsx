"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function DateBanner() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.15 });

  return (
    <section id="date-banner" ref={ref} className="relative mx-auto grid min-h-[60vh] max-w-5xl place-items-center px-5 py-20 text-center">
      <div className="space-y-5">
        <h2 data-reveal className="section-title text-6xl font-light text-burgundy-900 md:text-8xl">
          {t("dateBanner.title")}
        </h2>
        <p data-reveal className="font-serif text-xl italic text-burgundy-900/70 md:text-2xl">
          {t("dateBanner.tagline")}
        </p>
      </div>
    </section>
  );
}
