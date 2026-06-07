"use client";

/**
 * SnapScrollController — turns any single scroll/wheel/swipe/keypress into
 * a one-section navigation. The native CSS scroll-snap (in globals.css)
 * stays as a safety net for users who get past the JS guard, but normally
 * the JS owns scrolling:
 *
 *   - First down gesture on hero opens the envelope, then later gestures
 *     move section-by-section
 *   - Wheel down / swipe up / ArrowDown / PageDown / Space → next section
 *   - Wheel up / swipe down / ArrowUp / PageUp           → previous section
 *   - Home / End                                          → first / last
 *
 * A short cooldown prevents momentum scroll (Mac trackpads especially)
 * from blasting through multiple sections per gesture.
 */

import { useEffect } from "react";

const COOLDOWN_MS = 900;            // initial lock-out window after navigation
const HERO_OPEN_COOLDOWN_MS = 1500; // first down gesture opens the envelope
const INERTIA_EXTENSION_MS = 350;   // each wheel event during cooldown extends
                                    // lock by this much — defeats trackpad
                                    // momentum scroll which keeps firing events
                                    // for 500–1500ms after finger-lift
const TOUCH_THRESHOLD_PX = 60;      // min vertical swipe distance to trigger nav
const SECTION_SETTLED_PX = 12;      // section must be snapped here before opening

export function SnapScrollController() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main.wedding-canvas > section")
    );
    if (sections.length === 0) return;

    const heroIndex = sections.findIndex((section) => section.id === "hero");
    const heroSection = heroIndex >= 0 ? sections[heroIndex] : null;

    let currentIndex = 0;
    let lockUntil = 0;
    let heroEnvelopeTriggered = heroSection?.dataset.envelopeOpened === "true";

    const isMobileViewport = () =>
      window.matchMedia("(max-width: 639px)").matches;

    const indexFromScroll = () => {
      const viewportH = window.innerHeight;
      const scrollY = window.scrollY;
      // Round to nearest section based on midpoint
      return Math.min(
        sections.length - 1,
        Math.max(0, Math.round(scrollY / viewportH))
      );
    };

    const goTo = (idx: number) => {
      const next = Math.max(0, Math.min(sections.length - 1, idx));
      if (next === currentIndex) return;
      currentIndex = next;
      lockUntil = Date.now() + COOLDOWN_MS;
      sections[next].scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const shouldOpenHeroEnvelope = () => {
      if (!heroSection || heroIndex < 0) return false;
      if (isMobileViewport()) return false;
      if (currentIndex !== heroIndex) return false;
      if (Math.abs(heroSection.getBoundingClientRect().top) > SECTION_SETTLED_PX) {
        return false;
      }
      if (heroEnvelopeTriggered) return false;
      if (heroSection.dataset.envelopeOpened === "true") {
        heroEnvelopeTriggered = true;
        return false;
      }
      return true;
    };

    const openHeroEnvelope = () => {
      if (!heroSection) return;
      heroEnvelopeTriggered = true;
      lockUntil = Date.now() + HERO_OPEN_COOLDOWN_MS;
      heroSection.scrollIntoView({ behavior: "auto", block: "start" });
      window.dispatchEvent(new CustomEvent("hero:open-envelope"));
    };

    const onWheel = (e: WheelEvent) => {
      // Allow zoom and modifier-key combos to pass through
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      const now = Date.now();

      // KEY FIX for Mac trackpad: while we're in the cooldown window, any
      // arriving wheel event EXTENDS the lock by INERTIA_EXTENSION_MS. This
      // means as long as momentum events keep firing, the lock stays armed.
      // The lock only truly expires after the wheel events go quiet for
      // INERTIA_EXTENSION_MS. Without this, a momentum event arriving just
      // after the initial 900ms cooldown would trigger an unwanted second
      // section advance.
      if (now < lockUntil) {
        lockUntil = Math.max(lockUntil, now + INERTIA_EXTENSION_MS);
        return;
      }

      currentIndex = indexFromScroll(); // re-sync in case user jumped via anchor
      if (e.deltaY > 0) {
        if (shouldOpenHeroEnvelope()) {
          openHeroEnvelope();
          return;
        }
        goTo(currentIndex + 1);
      }
      else if (e.deltaY < 0) goTo(currentIndex - 1);
    };

    const onKey = (e: KeyboardEvent) => {
      // Skip if focus is on an input/textarea — let the user type
      const target = e.target as HTMLElement;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;

      if (Date.now() < lockUntil) return;
      currentIndex = indexFromScroll();

      if (["ArrowDown", "PageDown", " ", "Space"].includes(e.key)) {
        e.preventDefault();
        if (shouldOpenHeroEnvelope()) {
          openHeroEnvelope();
          return;
        }
        goTo(currentIndex + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(currentIndex - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(sections.length - 1);
      }
    };

    let touchStartY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isMobileViewport()) return;
      if (touchStartY === null) return;
      if (e.touches.length !== 1) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (dy <= TOUCH_THRESHOLD_PX) return;

      currentIndex = indexFromScroll();
      if (!shouldOpenHeroEnvelope()) return;

      e.preventDefault();
      touchStartY = null;
      openHeroEnvelope();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;
      if (Date.now() < lockUntil) {
        touchStartY = null;
        return;
      }
      const dy = touchStartY - e.changedTouches[0].clientY;
      touchStartY = null;
      if (Math.abs(dy) < TOUCH_THRESHOLD_PX) return;
      currentIndex = indexFromScroll();
      if (dy > 0) {
        if (shouldOpenHeroEnvelope()) {
          openHeroEnvelope();
          return;
        }
        goTo(currentIndex + 1);
      }
      else goTo(currentIndex - 1);
    };

    // Sync currentIndex on programmatic scroll (e.g. hero's scrollIntoView on
    // "scroll for details") so the next wheel event picks up the new position.
    const onScrollEnd = () => {
      currentIndex = indexFromScroll();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);

    // Initial sync
    currentIndex = indexFromScroll();

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, []);

  return null;
}
