"use client";

import { useRef } from "react";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Sentiment1() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.18 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-5 py-20">
      <div className="grid w-full items-center gap-10 md:grid-cols-2">
        <div data-reveal className="paper-panel overflow-hidden">
          <Image
            src={invitation.photos.portrait}
            alt=""
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
          />
        </div>
        <p data-reveal className="font-serif text-xl italic leading-relaxed text-burgundy-900/85 md:text-2xl">
          {t("sentiment1.body")}
        </p>
      </div>
    </section>
  );
}
