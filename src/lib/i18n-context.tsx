"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { dict, type Locale } from "@/data/i18n";

type Ctx = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function LanguageProvider({
  initial,
  children,
}: {
  initial: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initial);
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [router]
  );

  const t = useCallback(
    (key: string) => {
      const value = dict[locale][key] ?? dict.vi[key];
      if (process.env.NODE_ENV !== "production" && value === undefined) {
        console.warn(`[i18n] missing key: ${key}`);
        return key;
      }
      return value ?? key;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used inside <LanguageProvider>");
  return ctx.t;
}

export function useLanguage() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}
