# Thiệp Cưới 1 — Design Spec

**Date:** 2026-05-30
**Project:** `next-gsap-wedding`
**Goal:** Convert the existing single-page wedding invitation (Emma & Lucas, English, 6 sections, moss palette) into a Vietnamese wedding invitation modeled on [cinelove.me/template/thiep-cuoi-1](https://cinelove.me/template/thiep-cuoi-1). Couple: **Thiện Trung (chú rể) & Quỳnh Trang (cô dâu)**. Site is bilingual VI/EN with a runtime toggle. All copy and data live in a typed data layer designed to be swapped for a CMS later.

---

## Decisions captured during brainstorming

| # | Decision | Choice | Why |
|---|---|---|---|
| 1 | Scope | Convert in place (one page replaces Emma & Lucas) | Single-purpose site; no need to maintain both templates |
| 2 | Couple identity | Real names: Thiện Trung & Quỳnh Trang. Date/venue/photos/prose: placeholder (starter copy supplied by this build, editable in `src/data/` or via future CMS) | User has real names; rest will come from the CMS later |
| 3 | Language | VI ↔ EN runtime toggle | Audience is Vietnamese; English option for non-Vietnamese guests |
| 4 | Section coverage | Full mirror (~17 sections from reference) + keep the existing RSVP form (18 total) | User wants the romantic reference structure; the existing RSVP works and is worth keeping |
| 5 | Visual style | Hybrid: cream base + burgundy accents, lighter than reference, more whitespace | Modern feel, easier to read than the saturated reference |
| 6 | Backend scope | UI-only today. Future CMS handles persistence | CMS comes after this front-end work |
| 7 | Animation level | Reference-level (scroll-driven, parallax, staggered) | User wants the cinelove.me feel |

---

## Architecture

### Directory structure (new / changed)

```
src/
├── data/
│   ├── invitation.ts        ← couple, dates (solar+lunar), venue, photos
│   ├── i18n.ts              ← { vi: {...}, en: {...} } string dictionaries
│   └── sections.ts          ← ['hero', 'welcome', 'quote-three-things', ...]
├── lib/
│   ├── i18n-context.tsx     ← LanguageProvider + useT() + useLanguage()
│   ├── use-scroll-reveal.ts ← GSAP ScrollTrigger reveal hook
│   ├── use-parallax.ts      ← GSAP ScrollTrigger scrub helper
│   ├── countdown.ts         ← (existing, kept)
│   ├── countdown.test.ts    ← (existing, kept)
│   ├── i18n.test.ts         ← (new) dict-key parity test
│   ├── sections.test.ts     ← (new) registry-completeness test
│   └── utils.ts             ← (existing, kept)
├── components/
│   ├── language-toggle.tsx  ← VI/EN button in fixed header
│   ├── music-toggle.tsx     ← floating button + <audio>
│   ├── gsap-register.tsx    ← client component: registers ScrollTrigger once
│   ├── section-renderer.tsx ← key → component map; iterates sectionOrder
│   └── sections/
│       ├── hero.tsx
│       ├── date-banner.tsx
│       ├── names.tsx
│       ├── invitation-title.tsx
│       ├── welcome-message.tsx
│       ├── gratitude-en.tsx
│       ├── poetry-1.tsx
│       ├── quote-three-things.tsx
│       ├── countdown.tsx
│       ├── sentiment-1.tsx
│       ├── poetry-2.tsx
│       ├── date-details.tsx
│       ├── calendar.tsx
│       ├── closing-sentiment.tsx
│       ├── venue.tsx
│       ├── rsvp.tsx
│       ├── guest-interaction.tsx
│       └── thank-you.tsx
└── app/
    ├── layout.tsx           ← reads lang cookie, wraps in LanguageProvider
    ├── page.tsx             ← <SectionRenderer />
    └── globals.css          ← palette tokens replaced
```

### Type contracts (the CMS will produce these exact shapes)

```ts
// src/data/invitation.ts
export type Invitation = {
  couple: {
    groom: { name: string };
    bride: { name: string };
    initials: string;        // "T&Q"
  };
  ceremony: {
    solarDate: string;       // ISO: "2027-05-22"
    lunarDate: string;       // localized: "Thứ bảy, 02/04 Âm lịch"
    time: string;            // "12:00"
    venue: { name: string; address: string; mapUrl: string };
  };
  rsvp: { deadline: string }; // ISO date
  photos: {
    hero: string;
    portrait: string;
    gallery: string[];
  };
};

// src/data/i18n.ts
export type Locale = 'vi' | 'en';
export type Dict = Record<string, string>;
export const dict: Record<Locale, Dict> = { vi: { /* ... */ }, en: { /* ... */ } };

// src/data/sections.ts
export type SectionKey =
  | 'hero' | 'date-banner' | 'names' | 'invitation-title'
  | 'welcome-message' | 'gratitude-en' | 'poetry-1' | 'quote-three-things'
  | 'countdown' | 'sentiment-1' | 'poetry-2' | 'date-details'
  | 'calendar' | 'closing-sentiment' | 'venue' | 'rsvp'
  | 'guest-interaction' | 'thank-you';
export const sectionOrder: SectionKey[] = [/* listed below */];
```

**Separation principle:** structured data (`invitation.ts`) is language-agnostic. Translatable copy (`i18n.ts`) lives separately so updating the couple's name once keeps both languages in sync. Section order is its own file so a CMS admin can reorder without touching either.

---

## The 18 sections (in render order)

Each is a component in `src/components/sections/<key>.tsx`. Animation column describes scroll behavior on first viewport entry.

| # | Key | Content | Animation |
|---|---|---|---|
| 1 | `hero` | Couple names + envelope-open click → reveals Save-the-Date card with hero photo. Music toggle + scroll-hint chevron at bottom. | **Existing GSAP envelope-open timeline preserved**; entrance fade on couple names |
| 2 | `date-banner` | Big date "2027.05.22" + tagline ("Đã lâu rồi, hẹn gặp ở đám cưới nhé!") | Fade-up |
| 3 | `names` | Two labeled cards: CHÚ RỂ Thiện Trung / CÔ DÂU Quỳnh Trang. Placeholder parent names | Stagger slide-in from sides |
| 4 | `invitation-title` | "THIỆP MỜI CƯỚI CỦA CHÚNG MÌNH" with decorative word stack "LOVE / WEDDING / FALL IN" | Word-by-word stagger |
| 5 | `welcome-message` | One-paragraph Vietnamese prose welcome, centered serif | Scroll fade |
| 6 | `gratitude-en` | Brief English thank-you, flanked by couple names | Fade-up |
| 7 | `poetry-1` | Vietnamese verse + English gloss below | Line-by-line stagger |
| 8 | `quote-three-things` | "Em yêu ba điều trên thế giới này — mặt trời, mặt trăng và em…" / EN gloss. Full-bleed | Parallax background + word stagger |
| 9 | `countdown` | Days/hours/min/sec to `ceremony.solarDate`. **Reuses existing `Countdown` component** | Tabular nums; entrance fade |
| 10 | `sentiment-1` | Vietnamese prose about the beloved | Scroll fade |
| 11 | `poetry-2` | Two more short verses (each VI + EN), stacked | Per-verse stagger |
| 12 | `date-details` | Solar date + lunar date + time + day-of-week | Fade-up |
| 13 | `calendar` | Month grid (1–31), heart icon on ceremony day | Cell-by-cell pop-in |
| 14 | `closing-sentiment` | Final romantic quote, full-bleed centered | Parallax |
| 15 | `venue` | Venue name + address + Google Maps link (no embed) | Fade-up + icon spin |
| 16 | `rsvp` | **Existing RSVP form structure preserved** — same fields (name + message), same submit-to-thank-you state, same styling pattern. Hardcoded English labels are replaced with `useT()` calls so the form is bilingual | Fade-up + input focus micro-interactions |
| 17 | `guest-interaction` | Message wall (5–8 placeholder messages, inline constant in the section file, marked for CMS replacement) + "Bắn tim" send-hearts button with GSAP-driven particle burst (no extra library) | Hearts particle burst on click; bubble entrance for messages |
| 18 | `thank-you` | Monogram **T&Q** + "Cảm ơn" / "Thank you" + "Formal invitation to follow" | Final fade-in |

### Section count rationale
The reference has 17 sections and no RSVP form. The existing app's RSVP form works, so it's kept as section #16. If a strict 17-section mirror is preferred later, drop `rsvp` from `sectionOrder` — the component stays available.

---

## Systems

### Internationalization (VI ↔ EN)

- **Default locale:** `vi`. Audience is Vietnamese; English is secondary.
- **Persistence:** HTTP cookie `lang`, not localStorage. Reason: Next.js renders the first paint on the server. A cookie is server-readable, eliminating the EN-then-VI flicker that localStorage would cause.
- **Flow:**
  1. `app/layout.tsx` reads cookie via `next/headers`, defaults to `'vi'`, sets `<html lang={locale}>`, passes to `<LanguageProvider initial={locale}>`.
  2. `LanguageProvider` (client) holds locale state, exposes `useT(key)` and `setLocale(loc)`.
  3. `<LanguageToggle>` button (fixed top-right) calls `setLocale`: updates state, writes cookie, calls `router.refresh()` so any server-rendered pieces re-evaluate. No full page reload.
  4. Missing key → fall back to VI → fall back to the key string itself, with `console.warn` in dev.
- **HTML `lang` attribute** updates correctly because the cookie change triggers a refresh of `layout.tsx`.

### Animations (GSAP ScrollTrigger)

- **Plugin:** `gsap/ScrollTrigger` ships with the installed `gsap` package — no new dependency.
- **Registration:** once, in `components/gsap-register.tsx` (client component, mounted in `layout.tsx`):
  ```ts
  if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  ```
- **Reveal hook** (`src/lib/use-scroll-reveal.ts`):
  ```ts
  useScrollReveal(ref, { from: { y: 60, opacity: 0 }, stagger: 0.08, start: 'top 80%' });
  ```
  Internally creates a ScrollTrigger that fires when the element enters the viewport.
- **Parallax hook** (`src/lib/use-parallax.ts`): for sections #8 and #14, uses ScrollTrigger's `scrub: true` for smooth scroll-tied motion.
- **Reduced motion:** every animation hook checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` on mount. If reduced, it `gsap.set()`s the target to its final state instead of animating. Same pattern the existing `wedding-stage.tsx` uses — extracted into the hook.
- **Music:** `<MusicToggle>` floating button toggles a hidden `<audio src="/wedding-assets/music.mp3" loop>` (placeholder mp3 to be supplied). Requires user gesture per browser autoplay policy — the button click is the gesture.

### Styling (Tailwind + globals.css)

**Palette tokens** (replace moss/champagne in `tailwind.config.ts`):

```ts
colors: {
  cream:    { 50: '#f8f3eb', 100: '#e8d9c2' },
  bronze:   { 500: '#b58552' },
  burgundy: { 600: '#7a2d2d', 900: '#2d2218' },
}
```

**Fonts** (via `next/font/google` in `layout.tsx` for performance, no CLS):
- **Cormorant Garamond** (serif italic) — couple names, romantic headlines
- **Playfair Display** (serif) — section titles
- **Inter** (sans) — body, labels, form

**Globals.css:** existing utility classes (`paper-panel`, `monogram`, `wedding-canvas`) are retuned to the new palette; `moss-*` / `champagne-*` / `parchment-*` references are removed.

**Asset caveat:** existing PNGs in `/public/wedding-assets/` were art-directed for the moss palette. They will be used as-is for now; any that clash with cream are documented for post-implementation review and CMS replacement.

---

## Testing strategy

Stays on the existing test runner: `node --test src/lib/*.test.ts`. No JSDOM/RTL added.

**Unit tests:**
- `src/lib/countdown.test.ts` — kept as-is.
- `src/lib/i18n.test.ts` (new) — assert every key in `dict.vi` is in `dict.en` and vice versa. Prevents one-language blanks.
- `src/lib/sections.test.ts` (new) — assert every key in `sectionOrder` resolves to a component in the renderer's map. Prevents typo bugs after rename.

Tests live in `src/lib/` (not `src/data/`) so the existing `node --test src/lib/*.test.ts` script in `package.json` picks them up without change. The test files import from `src/data/`.

**Manual smoke (dev server on :3002):**
1. Cold load `/` → VI hero on first paint, no flash.
2. Toggle EN → page swaps to English → refresh → still EN (cookie persisted).
3. Slow-scroll → every section animates in on first viewport entry.
4. DevTools → Rendering → `prefers-reduced-motion: reduce` → all sections visible at final state, no animation.
5. Mobile DevTools → envelope-open works on touch.
6. RSVP: empty submit → validation errors; valid submit → thank-you state (no network).
7. Send-hearts: clicking triggers burst, local counter increments.
8. Music toggle: plays/pauses placeholder mp3.

**Out of scope for tests:**
- React component snapshots — over-fragile for content that will change.
- Visual regression — not worth the infra for one page.
- E2E — manual checks cover the user paths.

---

## Future CMS contract

Today's `src/data/*.ts` files **are** the CMS contract. When the real CMS lands, each file is replaced with an async fetcher returning the same type:

```ts
// Today (in repo)
export const invitation: Invitation = { /* hardcoded */ };

// Tomorrow (CMS-backed, same import path, async)
export async function getInvitation(): Promise<Invitation> {
  return fetch(`${CMS_URL}/invitations/${slug}`).then(r => r.json());
}
```

Section components become server components that `await getInvitation()` and pass props to client children. Toggles/forms/animations stay client. Because the type signature is identical, no component logic changes.

**The CMS will need to provide:**
1. `Invitation` (couple, dates, venue, photo URLs)
2. `dict.vi` and `dict.en` (keys must match)
3. `sectionOrder` (allows admin to reorder/hide)
4. Image storage (Cloudinary/S3) returning URLs that go into `Invitation.photos`

Each data file gets a top-of-file comment documenting this contract for the CMS team.

---

## Explicitly out of scope

- The CMS itself — separate project, comes after this one.
- Real persistence for RSVP / message wall / send-hearts — deferred to CMS.
- Multi-template support — would require a registry-per-template variant of Approach 1; deferred.
- Embedded map (Google Maps iframe) — replaced with a link for now.
- Email notifications.
- Admin UI.

---

## Implementation order (preview — full plan to come)

1. Palette + font swap; data files scaffolded with placeholders.
2. i18n context + cookie wiring + `<LanguageToggle>`.
3. `<SectionRenderer>` + section keys; ports existing hero, countdown, RSVP, thank-you sections first.
4. New sections in order: date-banner, names, invitation-title, welcome, gratitude, poetry-1, quote-three-things, sentiment-1, poetry-2, date-details, calendar, closing-sentiment, venue, guest-interaction.
5. ScrollTrigger reveal hook + parallax hook applied per section.
6. Send-hearts particle burst + message-wall placeholder list.
7. Music toggle wired to `<audio>` with placeholder mp3.
8. Tests for `i18n.ts` and `sections.ts`; manual smoke; reduced-motion check.

Detailed implementation plan to follow in `docs/superpowers/plans/`.
