"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Sentiment1() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[50vh] max-w-3xl place-items-center px-5 py-20 text-center">
      <p className="font-serif text-xl italic leading-relaxed text-burgundy-900/85 md:text-2xl">
        {t("sentiment1.body")}
      </p>
    </section>
  );
}
