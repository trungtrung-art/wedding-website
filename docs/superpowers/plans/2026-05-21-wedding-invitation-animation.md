# Wedding Invitation Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Canva-inspired envelope opening animation and scroll invitation scenes.

**Architecture:** Keep the feature inside `src/components/wedding-stage.tsx` with a small client-side GSAP timeline and static invitation data. Use `src/app/globals.css` for reusable texture and envelope helpers that are awkward to express in Tailwind utility classes.

**Tech Stack:** Next.js app router, React 19, TypeScript, Tailwind CSS, GSAP, lucide-react.

---

### Task 1: Animated Invitation Stage

**Files:**
- Modify: `src/components/wedding-stage.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add client-side GSAP opener**

Convert `WeddingStage` to a client component. Add refs for envelope layers, create an `openInvitation` handler, and animate flap, seal, florals, card, intro copy, and the scroll hint.

- [ ] **Step 2: Add scroll scenes**

Render full-height sections after the opener: music/date, calendar/location, RSVP, countdown, and closing. Keep the RSVP as a styled placeholder with an iframe-ready area.

- [ ] **Step 3: Add CSS helpers**

Add parchment texture, paper grain, envelope flap, floral sprig, photo placeholder, countdown typography, and reduced-motion fallbacks in `globals.css`.

- [ ] **Step 4: Verify**

Run `npm run lint` and `npm run build`. Preview at `http://localhost:3001` and confirm the envelope opens on click and the page scrolls through the invitation sections.
