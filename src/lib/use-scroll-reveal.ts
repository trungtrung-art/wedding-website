"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealOptions = {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  start?: string;       // ScrollTrigger start, default "top 80%"
  stagger?: number;     // if the ref's children should animate sequentially
  childSelector?: string; // querySelector for children to animate
};

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  opts: RevealOptions = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = opts.childSelector
      ? Array.from(el.querySelectorAll<HTMLElement>(opts.childSelector))
      : [el];

    const from = opts.from ?? { y: 60, autoAlpha: 0 };
    const to = opts.to ?? { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" };

    if (reduceMotion) {
      gsap.set(targets, { ...to, duration: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, from);
      gsap.to(targets, {
        ...to,
        stagger: opts.stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
