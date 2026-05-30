"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Poetry2() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.2 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-screen max-w-3xl place-items-center px-5 py-20 text-center">
      <div className="space-y-16">
        {([
          { vi: t("poetry2.verse1.vi"), en: t("poetry2.verse1.en") },
          { vi: t("poetry2.verse2.vi"), en: t("poetry2.verse2.en") },
        ]).map((v, i) => (
          <div key={i} data-reveal className="space-y-4">
            <p className="whitespace-pre-line font-serif text-2xl italic leading-relaxed text-burgundy-900 md:text-3xl">{v.vi}</p>
            <p className="whitespace-pre-line text-sm italic text-burgundy-900/55 md:text-base">{v.en}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
