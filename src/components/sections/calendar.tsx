"use client";

import { useRef } from "react";
import { Heart } from "lucide-react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Calendar() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-cell]", stagger: 0.02, from: { autoAlpha: 0, scale: 0.6 }, to: { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.4)" } });

  const ceremonyDay = Number(invitation.ceremony.solarDate.split("-")[2]);
  const daysInMonth = 31;

  return (
    <section ref={ref} className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20 text-center">
      <div className="space-y-8">
        <p className="text-xs uppercase tracking-[0.4em] text-bronze-500">{t("calendar.monthLabel")}</p>
        <div className="mx-auto grid max-w-sm grid-cols-7 gap-3 font-serif text-xl text-burgundy-900 md:max-w-md md:text-2xl">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <span
              key={day}
              data-cell
              className={
                day === ceremonyDay
                  ? "relative grid aspect-square place-items-center rounded-full border border-burgundy-600 text-burgundy-600"
                  : "grid aspect-square place-items-center"
              }
            >
              {day === ceremonyDay ? (
                <span className="grid place-items-center">
                  <Heart className="absolute h-9 w-9 text-burgundy-600/30" strokeWidth={1.2} />
                  <span className="relative">{day}</span>
                </span>
              ) : (
                day
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
