"use client";

import { useRef } from "react";
import { MapPin } from "lucide-react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Venue() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.12 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-5 py-20 text-center">
      <div className="space-y-5">
        <MapPin data-reveal className="mx-auto h-10 w-10 text-bronze-500" strokeWidth={1.3} />
        <p data-reveal className="text-xs uppercase tracking-[0.4em] text-bronze-500">{t("venue.eyebrow")}</p>
        <h3 data-reveal className="section-title text-3xl font-light text-burgundy-900 md:text-4xl">
          {invitation.ceremony.venue.name}
        </h3>
        <p data-reveal className="text-sm text-burgundy-900/75 md:text-base">
          {invitation.ceremony.venue.address}
        </p>
        <a
          data-reveal
          href={invitation.ceremony.venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-burgundy-600 px-6 py-2 text-xs uppercase tracking-[0.3em] text-burgundy-600 transition hover:bg-burgundy-600 hover:text-cream-50"
        >
          {t("venue.mapCta")}
        </a>
      </div>
    </section>
  );
}
