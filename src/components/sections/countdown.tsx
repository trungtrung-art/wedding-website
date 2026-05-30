"use client";

import { useEffect, useState, useRef } from "react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { getCountdownParts, type CountdownParts } from "@/lib/countdown";

export function Countdown() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.08 });

  const [parts, setParts] = useState<CountdownParts>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(invitation.ceremony.solarDate + "T" + invitation.ceremony.time + ":00");
    const tick = () => setParts(getCountdownParts(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section ref={ref} className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20 text-center">
      <div className="space-y-8">
        <p data-reveal className="font-serif text-5xl italic text-burgundy-900/70 md:text-7xl">{t("countdown.eyebrow")}</p>
        <h2 data-reveal className="section-title text-5xl font-light uppercase text-burgundy-900 md:text-7xl">
          {t("countdown.title")}
        </h2>
        <p data-reveal className="text-xs uppercase tracking-[0.42em] text-burgundy-900/60">
          {t("countdown.subtitle")}
        </p>
        <div data-reveal className="grid grid-cols-4 gap-3 text-center text-burgundy-900 md:gap-7">
          {(["days", "hours", "minutes", "seconds"] as const).map((label) => (
            <div key={label} className="min-w-16">
              <div className="font-serif text-3xl font-light tabular-nums md:text-5xl">
                {String(parts[label]).padStart(2, "0")}
              </div>
              <div className="mt-2 text-[0.62rem] uppercase tracking-[0.28em] text-burgundy-900/60">
                {t(`countdown.${label}`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
