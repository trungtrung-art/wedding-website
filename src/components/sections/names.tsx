"use client";

import { useRef } from "react";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Names() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.18 });

  return (
    <section ref={ref} className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20">
      <div className="grid w-full gap-10 md:grid-cols-2">
        {([
          { label: t("names.groomLabel"), name: invitation.couple.groom.name, parents: t("names.groomParents") },
          { label: t("names.brideLabel"), name: invitation.couple.bride.name, parents: t("names.brideParents") },
        ]).map((person) => (
          <div key={person.label} data-reveal className="paper-panel px-8 py-12 text-center">
            <Image
              src={invitation.photos.portrait}
              alt={person.name}
              width={400}
              height={400}
              className="mx-auto mb-6 h-40 w-40 rounded-full object-cover"
            />
            <p className="text-xs uppercase tracking-[0.4em] text-bronze-500">{person.label}</p>
            <p className="mt-3 font-serif text-4xl text-burgundy-900">{person.name}</p>
            <p className="mt-4 text-sm italic text-burgundy-900/65">{person.parents}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
