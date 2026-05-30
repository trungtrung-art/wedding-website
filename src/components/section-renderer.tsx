import type { ComponentType } from "react";
import { sectionOrder, type SectionKey } from "@/data/sections";
import { Hero } from "./sections/hero";

const Placeholder = (label: string): ComponentType => () => (
  <section className="mx-auto grid min-h-[40vh] max-w-5xl place-items-center px-5 py-20 text-burgundy-900/40">
    <p className="text-xs uppercase tracking-[0.3em]">[ {label} ]</p>
  </section>
);

export const SECTION_REGISTRY: Record<SectionKey, ComponentType> = {
  "hero": Hero,
  "date-banner": Placeholder("date-banner"),
  "names": Placeholder("names"),
  "invitation-title": Placeholder("invitation-title"),
  "welcome-message": Placeholder("welcome-message"),
  "gratitude-en": Placeholder("gratitude-en"),
  "poetry-1": Placeholder("poetry-1"),
  "quote-three-things": Placeholder("quote-three-things"),
  "countdown": Placeholder("countdown"),
  "sentiment-1": Placeholder("sentiment-1"),
  "poetry-2": Placeholder("poetry-2"),
  "date-details": Placeholder("date-details"),
  "calendar": Placeholder("calendar"),
  "closing-sentiment": Placeholder("closing-sentiment"),
  "venue": Placeholder("venue"),
  "rsvp": Placeholder("rsvp"),
  "guest-interaction": Placeholder("guest-interaction"),
  "thank-you": Placeholder("thank-you"),
};

export function SectionRenderer() {
  return (
    <main className="wedding-canvas relative min-h-screen overflow-x-hidden">
      {sectionOrder.map((key) => {
        const Section = SECTION_REGISTRY[key];
        return <Section key={key} />;
      })}
    </main>
  );
}
