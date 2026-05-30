"use client";

import { useRef } from "react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function GratitudeEn() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[50vh] max-w-3xl place-items-center px-5 py-20 text-center">
      <div className="space-y-4">
        <p className="font-serif text-lg italic text-burgundy-900/80 md:text-xl">{t("gratitudeEn.body")}</p>
        <p className="text-xs uppercase tracking-[0.4em] text-bronze-500">
          {invitation.couple.groom.name} & {invitation.couple.bride.name}
        </p>
      </div>
    </section>
  );
}
