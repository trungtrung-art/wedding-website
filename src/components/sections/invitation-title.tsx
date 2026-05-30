"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function InvitationTitle() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.12 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-5 py-20 text-center">
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-1 font-serif text-5xl uppercase tracking-[0.3em] text-burgundy-900/30 md:text-7xl">
          <span data-reveal>{t("invitationTitle.stack1")}</span>
          <span data-reveal className="text-burgundy-900">{t("invitationTitle.stack2")}</span>
          <span data-reveal>{t("invitationTitle.stack3")}</span>
        </div>
        <p data-reveal className="section-title text-2xl uppercase tracking-[0.3em] text-burgundy-900 md:text-3xl">
          {t("invitationTitle.main")}
        </p>
      </div>
    </section>
  );
}
