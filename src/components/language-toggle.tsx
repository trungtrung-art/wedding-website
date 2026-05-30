"use client";

import { useLanguage } from "@/lib/i18n-context";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const next = locale === "vi" ? "en" : "vi";

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={`Switch to ${next === "en" ? "English" : "Vietnamese"}`}
      className="fixed right-4 top-4 z-50 rounded-full border border-burgundy-600/40 bg-cream-50/90 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-burgundy-900 backdrop-blur transition hover:bg-cream-100"
    >
      {locale === "vi" ? "EN" : "VI"}
    </button>
  );
}
