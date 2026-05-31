"use client";

/**
 * SnapScrollController — turns any single scroll/wheel/swipe/keypress into
 * a one-section navigation. The native CSS scroll-snap (in globals.css)
 * stays as a safety net for users who get past the JS guard, but normally
 * the JS owns scrolling:
 *
 *   - Wheel down / swipe up / ArrowDown / PageDown / Space → next section
 *   - Wheel up / swipe down / ArrowUp / PageUp           → previous section
 *   - Home / End                                          → first / last
 *
 * A short cooldown prevents momentum scroll (Mac trackpads especially)
 * from blasting through multiple sections per gesture.
 */

import { useEffect } from "react";

const COOLDOWN_MS = 900;        // lock-out window after each navigation
const TOUCH_THRESHOLD_PX = 60;  // min vertical swipe distance to trigger nav

export function SnapScrollController() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main.wedding-canvas > section")
    );
    if (sections.length === 0) return;

    let currentIndex = 0;
    let lockUntil = 0;

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

    const onWheel = (e: WheelEvent) => {
      // Allow zoom and modifier-key combos to pass through
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      if (Date.now() < lockUntil) return;
      currentIndex = indexFromScroll(); // re-sync in case user jumped via anchor
      if (e.deltaY > 0) goTo(currentIndex + 1);
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
      if (dy > 0) goTo(currentIndex + 1);
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
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);

    // Initial sync
    currentIndex = indexFromScroll();

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, []);

  return null;
}
