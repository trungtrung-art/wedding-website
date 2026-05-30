"use client";

import { useRef } from "react";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function WelcomeMessage() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.15 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-5 py-20 text-center">
      <div className="space-y-8">
        <div data-reveal className="paper-panel mx-auto max-w-md overflow-hidden">
          <Image
            src={invitation.photos.hero}
            alt=""
            width={1200}
            height={800}
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
        <p data-reveal className="font-serif text-xl leading-relaxed text-burgundy-900/85 md:text-2xl">
          {t("welcome.body")}
        </p>
      </div>
    </section>
  );
}
