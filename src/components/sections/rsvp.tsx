"use client";

import { useRef, useState } from "react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Rsvp() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section ref={ref} className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20">
      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="text-left">
          <p className="section-title text-7xl font-light uppercase leading-none text-burgundy-900 md:text-8xl">
            {t("rsvp.title")}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.38em] text-bronze-500">
            {t("rsvp.deadline")} {invitation.rsvp.deadline}
          </p>
          <p className="mt-6 max-w-sm text-sm leading-7 text-burgundy-900/80">{t("rsvp.intro")}</p>
        </div>
        {submitted ? (
          <div className="rsvp-card text-center">
            <p className="font-serif text-2xl italic text-burgundy-900">{t("rsvp.success")}</p>
          </div>
        ) : (
          <form
            className="rsvp-card"
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          >
            <label htmlFor="guest-name" className="text-left text-sm font-medium text-burgundy-900">
              {t("rsvp.nameLabel")}
            </label>
            <input id="guest-name" placeholder={t("rsvp.namePlaceholder")} required />
            <label htmlFor="guest-note" className="mt-5 text-left text-sm font-medium text-burgundy-900">
              {t("rsvp.messageLabel")}
            </label>
            <textarea id="guest-note" placeholder={t("rsvp.messagePlaceholder")} rows={4} />
            <button type="submit">{t("rsvp.submit")}</button>
          </form>
        )}
      </div>
    </section>
  );
}
