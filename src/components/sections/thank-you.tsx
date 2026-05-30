"use client";

import { useRef } from "react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function ThankYou() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.12 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20 text-center">
      <div className="space-y-8">
        <div data-reveal className="monogram mx-auto">{invitation.couple.initials}</div>
        <p data-reveal className="font-serif text-4xl font-light uppercase tracking-[0.34em] text-burgundy-900 md:text-5xl">
          {invitation.couple.groom.name} & {invitation.couple.bride.name}
        </p>
        <p data-reveal className="font-serif text-6xl italic text-burgundy-900 md:text-8xl">
          {t("thankYou.eyebrow")}
        </p>
        <p data-reveal className="font-serif text-2xl italic tracking-[0.1em] text-burgundy-900/80">
          {t("thankYou.follow")}
        </p>
      </div>
    </section>
  );
}
