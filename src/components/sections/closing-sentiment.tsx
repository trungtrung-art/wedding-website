"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { useParallax } from "@/lib/use-parallax";
import { invitation } from "@/data/invitation";

export function ClosingSentiment() {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);
  useParallax(bgRef, 0.3);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream-100 py-32 text-center">
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('${invitation.photos.hero}')` }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at center, rgba(248, 243, 235, 0.85), rgba(248, 243, 235, 0.55) 60%, transparent 90%)" }}
      />
      <p className="relative mx-auto max-w-3xl px-5 font-serif text-2xl italic leading-relaxed text-burgundy-900 md:text-4xl">
        {t("closingSentiment.body")}
      </p>
    </section>
  );
}
