"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Poetry1() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.2 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-5 py-20 text-center">
      <div className="space-y-6">
        <p data-reveal className="whitespace-pre-line font-serif text-2xl italic leading-relaxed text-burgundy-900 md:text-3xl">
          {t("poetry1.vi")}
        </p>
        <p data-reveal className="whitespace-pre-line text-sm italic text-burgundy-900/55 md:text-base">
          {t("poetry1.en")}
        </p>
      </div>
    </section>
  );
}
