"use client";

import { useRef } from "react";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Gallery() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.12 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-screen max-w-6xl place-items-center px-5 py-20 text-center">
      <div className="space-y-10 w-full">
        <div className="space-y-3">
          <p data-reveal className="text-xs uppercase tracking-[0.4em] text-bronze-500">{t("gallery.subtitle")}</p>
          <h3 data-reveal className="section-title text-4xl font-light text-burgundy-900 md:text-6xl">{t("gallery.title")}</h3>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {invitation.photos.gallery.map((src, i) => (
            <div key={i} data-reveal className="paper-panel overflow-hidden">
              <Image
                src={src}
                alt={`Gallery photo ${i + 1}`}
                width={800}
                height={800}
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
