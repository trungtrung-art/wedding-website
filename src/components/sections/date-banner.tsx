"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";

export function DateBanner() {
  const t = useT();
  const [ceremonyYear, ceremonyMonth, ceremonyDay] = invitation.ceremony.solarDate
    .split("-")
    .map(Number);
  const ceremonyMonthName = new Intl.DateTimeFormat("en", {
    month: "long",
  }).format(new Date(ceremonyYear, ceremonyMonth - 1, ceremonyDay));
  const ceremonyDayLabel = String(ceremonyDay).padStart(2, "0");
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);
  const monthRef = useRef<HTMLSpanElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const ornamentRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lines = lineRefs.current.filter(Boolean);
    const ornaments = ornamentRefs.current.filter(Boolean);
    const textItems = [
      crestRef.current,
      dayRef.current,
      monthRef.current,
      yearRef.current,
      taglineRef.current,
    ].filter(Boolean);

    if (reduceMotion) {
      gsap.set([labelRef.current, ...lines, ...ornaments, ...textItems], {
        autoAlpha: 1,
        clearProps: "transform,filter",
      });
      gsap.set(lines, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(labelRef.current, {
        autoAlpha: 0,
        y: 30,
        scale: 0.975,
        filter: "blur(5px)",
      });
      gsap.set(lines, { autoAlpha: 1, scaleX: 0 });
      gsap.set(ornaments, {
        autoAlpha: 0,
        scale: 0.75,
        rotate: -8,
      });
      gsap.set(textItems, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(5px)",
      });
      gsap.set(dayRef.current, {
        y: 28,
        letterSpacing: "0.08em",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 62%",
          toggleActions: "play none none none",
        },
      });

      tl
        .to(labelRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.68,
          ease: "power3.out",
        })
        .to(
          lines,
          {
            scaleX: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.32"
        )
        .to(
          ornaments,
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.5,
            ease: "back.out(1.35)",
            stagger: 0.07,
          },
          "-=0.45"
        )
        .to(
          [crestRef.current, monthRef.current, dayRef.current, yearRef.current],
          {
            autoAlpha: 1,
            y: 0,
            letterSpacing: (index) => (index === 2 ? "0" : undefined),
            filter: "blur(0px)",
            duration: 0.62,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.26"
        )
        .to(
          taglineRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.16"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="date-banner"
      ref={sectionRef}
      className="relative mx-auto grid min-h-screen max-w-screen-2xl place-items-center overflow-hidden px-5 py-14 text-center sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[48%] h-[min(90vw,48rem)] w-[min(90vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy-600/[0.06]" />
        <div className="absolute left-[10%] top-[18%] h-28 w-px rotate-[20deg] bg-bronze-500/28" />
        <div className="absolute bottom-[13%] right-[10%] h-32 w-px rotate-[20deg] bg-burgundy-600/16" />
      </div>

      <div
        ref={labelRef}
        className="paper-panel relative w-full max-w-[38rem] overflow-hidden px-6 py-10 sm:px-10 sm:py-12"
      >
        <div className="pointer-events-none absolute inset-3 border border-bronze-500/42" />
        <div className="pointer-events-none absolute inset-7 rounded-[50%] border border-burgundy-600/20" />
        <div className="pointer-events-none absolute inset-x-10 top-10 h-28 rounded-[50%] border-t border-bronze-500/36" />
        <div className="pointer-events-none absolute inset-x-10 bottom-10 h-28 rounded-[50%] border-b border-bronze-500/36" />

        <div className="relative mx-auto flex max-w-md items-center justify-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-burgundy-900/62 sm:text-xs">
          <span
            ref={(node) => {
              lineRefs.current[0] = node;
            }}
            className="h-px flex-1 origin-right bg-bronze-500/55"
            aria-hidden
          />
          <span>Estate</span>
          <span
            ref={(node) => {
              lineRefs.current[1] = node;
            }}
            className="h-px flex-1 origin-left bg-bronze-500/55"
            aria-hidden
          />
        </div>

        <div
          ref={crestRef}
          className="relative mx-auto mt-7 grid h-20 w-20 place-items-center rounded-full border border-bronze-500/60 font-serif text-xl italic text-burgundy-600"
        >
          <span
            ref={(node) => {
              ornamentRefs.current[0] = node;
            }}
            className="absolute -left-10 top-1/2 h-px w-8 origin-right bg-bronze-500/50"
            aria-hidden
          />
          <span
            ref={(node) => {
              ornamentRefs.current[1] = node;
            }}
            className="absolute -right-10 top-1/2 h-px w-8 origin-left bg-bronze-500/50"
            aria-hidden
          />
          {invitation.couple.initials}
        </div>

        <div className="relative mt-8">
          <span
            ref={monthRef}
            className="font-serif text-sm uppercase tracking-[0.6em] text-bronze-500 sm:text-base"
          >
            {ceremonyMonthName}
          </span>
          <span
            ref={dayRef}
            className="section-title block text-[clamp(7.5rem,31vw,14rem)] font-light leading-[0.78] text-burgundy-600"
          >
            {ceremonyDayLabel}
          </span>
          <span
            ref={yearRef}
            className="font-serif text-xl font-light tracking-[0.56em] text-burgundy-900/82 sm:text-2xl"
          >
            {ceremonyYear}
          </span>
        </div>

        <div className="relative mx-auto mt-8 flex max-w-md items-center justify-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-burgundy-900/55 sm:text-xs">
          <span
            ref={(node) => {
              lineRefs.current[2] = node;
            }}
            className="h-px flex-1 origin-right bg-bronze-500/45"
            aria-hidden
          />
          <span>Wedding vintage</span>
          <span
            ref={(node) => {
              lineRefs.current[3] = node;
            }}
            className="h-px flex-1 origin-left bg-bronze-500/45"
            aria-hidden
          />
        </div>

        <p
          ref={taglineRef}
          className="relative mx-auto mt-8 max-w-xl font-serif text-lg italic leading-relaxed text-burgundy-900/72 sm:text-xl md:text-2xl"
        >
          {t("dateBanner.tagline")}
        </p>
      </div>
    </section>
  );
}
