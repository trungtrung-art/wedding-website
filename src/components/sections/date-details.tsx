"use client";

import { useRef } from "react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function DateDetails() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.12 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[50vh] max-w-3xl place-items-center px-5 py-20 text-center">
      <div className="space-y-4">
        <p data-reveal className="text-xs uppercase tracking-[0.4em] text-bronze-500">
          {t("dateDetails.dayOfWeek")}
        </p>
        <p data-reveal className="section-title text-5xl font-light text-burgundy-900 md:text-7xl">
          {t("dateDetails.solar")}
        </p>
        <p data-reveal className="font-serif text-sm italic text-burgundy-900/70 md:text-base">
          {t("dateDetails.lunarPrefix")} {invitation.ceremony.lunarDate}
        </p>
        <p data-reveal className="font-serif text-base italic text-burgundy-900/80 md:text-lg">
          {t("dateDetails.timePrefix")} {invitation.ceremony.time}
        </p>
      </div>
    </section>
  );
}
