"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function WelcomeMessage() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-5 py-20 text-center">
      <p className="font-serif text-xl leading-relaxed text-burgundy-900/85 md:text-2xl">
        {t("welcome.body")}
      </p>
    </section>
  );
}
