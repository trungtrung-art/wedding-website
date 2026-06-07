"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";

export function DateBanner() {
  const t = useT();
  const [ceremonyYear, ceremonyMonth, ceremonyDay] = invitation.ceremony.solarDate
    .split("-")
    .map(Number);
  const ceremonyDate = new Date(ceremonyYear, ceremonyMonth - 1, ceremonyDay);
  const ceremonyMonthName = new Intl.DateTimeFormat("en", {
    month: "long",
  }).format(ceremonyDate);
  const ceremonyWeekday = new Intl.DateTimeFormat("en", {
    weekday: "long",
  }).format(ceremonyDate);
  const ceremonyDayLabel = String(ceremonyDay).padStart(2, "0");
  const formattedDate = `${String(ceremonyDay).padStart(2, "0")}.${String(
    ceremonyMonth
  ).padStart(2, "0")}.${ceremonyYear}`;
  const dateParts = [
    { label: "Day", value: ceremonyDayLabel },
    { label: "Month", value: String(ceremonyMonth).padStart(2, "0") },
    { label: "Year", value: String(ceremonyYear) },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);
  const monthRef = useRef<HTMLSpanElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const ornamentRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const detailRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lines = lineRefs.current.filter(Boolean);
    const ornaments = ornamentRefs.current.filter(Boolean);
    const sceneItems = sceneRefs.current.filter(Boolean);
    const details = detailRefs.current.filter(Boolean);
    const textItems = [
      dayRef.current,
      monthRef.current,
      yearRef.current,
      taglineRef.current,
      ...details,
    ].filter(Boolean);

    if (reduceMotion) {
      gsap.set([labelRef.current, ...lines, ...ornaments, ...sceneItems, ...textItems], {
        autoAlpha: 1,
        clearProps: "transform,filter",
      });
      gsap.set(lines, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(labelRef.current, {
        autoAlpha: 0,
        y: 34,
        scale: 0.97,
        filter: "blur(6px)",
      });
      gsap.set(sceneItems, {
        autoAlpha: 0,
        y: 34,
        rotate: (index) => [-5, 4, -9, 7, -4][index] ?? 0,
        scale: 0.96,
        filter: "blur(5px)",
      });
      gsap.set(lines, { autoAlpha: 1, scaleX: 0 });
      gsap.set(ornaments, {
        autoAlpha: 0,
        scale: 0.72,
        rotate: -10,
      });
      gsap.set(textItems, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(5px)",
      });
      gsap.set(dayRef.current, {
        y: 30,
        scale: 0.98,
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
        .to(sceneItems, {
          autoAlpha: 1,
          y: 0,
          rotate: (index) => [-2.5, 2.4, -6, 5, -2][index] ?? 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.64,
          ease: "power3.out",
          stagger: 0.06,
        })
        .to(
          labelRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.58,
            ease: "power3.out",
          },
          "-=0.48"
        )
        .to(
          lines,
          {
            scaleX: 1,
            duration: 0.52,
            ease: "power3.out",
            stagger: 0.06,
          },
          "-=0.32"
        )
        .to(
          ornaments,
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.42,
            ease: "back.out(1.35)",
            stagger: 0.05,
          },
          "-=0.44"
        )
        .to(
          [monthRef.current, dayRef.current, yearRef.current],
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.54,
            ease: "power3.out",
            stagger: 0.07,
          },
          "-=0.46"
        )
        .to(
          dayRef.current,
          {
            letterSpacing: "0",
            duration: 0.54,
            ease: "power3.out",
          },
          "<"
        )
        .to(
          [taglineRef.current, ...details],
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.48,
            ease: "power3.out",
            stagger: 0.05,
          },
          "-=0.18"
        );

      gsap.to(sceneItems, {
        y: (index) => [-8, 6, -5, 7, -4][index] ?? 0,
        rotate: (index) => [-3.6, 3.2, -7, 6, -2.8][index] ?? 0,
        duration: 5.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="date-banner"
      ref={sectionRef}
      className="relative mx-auto grid min-h-screen max-w-screen-2xl place-items-center overflow-hidden px-5 py-12 text-center sm:py-16 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/wedding-assets/wedding-scene.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.13] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_22%_18%,rgba(111,16,27,0.16),transparent_46%),radial-gradient(ellipse_at_78%_82%,rgba(196,154,90,0.18),transparent_48%),linear-gradient(180deg,rgba(239,227,221,0.88),rgba(239,227,221,0.7)_46%,rgba(230,209,202,0.9))]" />
        <div className="absolute left-1/2 top-1/2 h-[min(86vw,52rem)] w-[min(86vw,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-bronze-500/22" />
        <div className="absolute left-[6%] top-[14%] h-24 w-px rotate-[21deg] bg-bronze-500/30" />
        <div className="absolute bottom-[12%] right-[7%] h-32 w-px rotate-[21deg] bg-burgundy-600/18" />
      </div>

      <div className="relative grid w-full max-w-6xl items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="relative mx-auto hidden min-h-[34rem] w-full max-w-[31rem] lg:block">
          <div
            ref={(node) => {
              sceneRefs.current[0] = node;
            }}
            className="paper-panel absolute left-4 top-16 h-[22rem] w-[16rem] overflow-hidden p-3 text-left shadow-[0_30px_80px_-42px_rgba(37,19,18,0.55)]"
          >
            <Image
              src="/wedding-assets/photo-detail-1.png"
              alt=""
              width={420}
              height={560}
              className="h-full w-full object-cover"
            />
          </div>

          <div
            ref={(node) => {
              sceneRefs.current[1] = node;
            }}
            className="paper-panel absolute right-1 top-5 h-[14rem] w-[18rem] overflow-hidden p-3 shadow-[0_24px_70px_-40px_rgba(37,19,18,0.5)]"
          >
            <Image
              src="/wedding-assets/photo-detail-2.png"
              alt=""
              width={560}
              height={420}
              className="h-full w-full object-cover"
            />
          </div>

          <div
            ref={(node) => {
              sceneRefs.current[2] = node;
            }}
            className="absolute -left-7 bottom-4 h-52 w-52"
            aria-hidden
          >
            <Image
              src="/wedding-assets/white-roses.png"
              alt=""
              fill
              sizes="13rem"
              className="object-contain drop-shadow-[0_18px_18px_rgba(37,19,18,0.14)]"
            />
          </div>

          <div
            ref={(node) => {
              sceneRefs.current[3] = node;
            }}
            className="absolute bottom-10 right-4 h-64 w-40"
            aria-hidden
          >
            <Image
              src="/wedding-assets/pampas-grass.png"
              alt=""
              fill
              sizes="10rem"
              className="object-contain opacity-90 drop-shadow-[0_18px_18px_rgba(37,19,18,0.12)]"
            />
          </div>

          <div
            ref={(node) => {
              sceneRefs.current[4] = node;
            }}
            className="absolute bottom-20 right-12 grid h-36 w-36 place-items-center rounded-full border border-bronze-500/50 bg-cream-50/80 text-burgundy-900 shadow-[0_22px_60px_-36px_rgba(37,19,18,0.52)] backdrop-blur"
          >
            <div>
              <p className="font-serif text-4xl leading-none text-burgundy-600">
                {ceremonyDayLabel}
              </p>
              <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.38em] text-bronze-500">
                {ceremonyMonthName}
              </p>
            </div>
          </div>
        </div>

        <div
          ref={labelRef}
          className="paper-panel relative mx-auto w-full max-w-[42rem] overflow-hidden px-5 py-8 shadow-[0_36px_90px_-44px_rgba(37,19,18,0.58)] sm:px-8 sm:py-10 lg:mx-0 lg:px-10 lg:py-11"
        >
          <div className="pointer-events-none absolute inset-3 border border-bronze-500/38" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-burgundy-600/16" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-bronze-500/24" />
          <div className="pointer-events-none absolute inset-x-8 top-8 h-20 rounded-[50%] border-t border-bronze-500/30" />
          <div className="pointer-events-none absolute inset-x-8 bottom-8 h-20 rounded-[50%] border-b border-bronze-500/30" />

          <div className="relative mx-auto flex max-w-md items-center justify-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-burgundy-900/60 sm:text-xs">
            <span
              ref={(node) => {
                lineRefs.current[0] = node;
              }}
              className="h-px flex-1 origin-right bg-bronze-500/55"
              aria-hidden
            />
            <span>Save the date</span>
            <span
              ref={(node) => {
                lineRefs.current[1] = node;
              }}
              className="h-px flex-1 origin-left bg-bronze-500/55"
              aria-hidden
            />
          </div>

          <div className="relative mx-auto mt-6 grid h-16 w-16 place-items-center rounded-full border border-bronze-500/60 bg-cream-50/70 font-serif text-lg italic text-burgundy-600 shadow-[inset_0_0_0_7px_rgba(196,154,90,0.08)] sm:h-20 sm:w-20 sm:text-xl">
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

          <div className="relative mt-7">
            <span
              ref={monthRef}
              className="block font-serif text-sm uppercase tracking-[0.55em] text-bronze-500 sm:text-base"
            >
              {ceremonyMonthName}
            </span>
            <span
              ref={dayRef}
              className="section-title block text-[clamp(7.2rem,29vw,13.5rem)] font-light leading-[0.78] text-burgundy-600 drop-shadow-[0_16px_26px_rgba(111,16,27,0.12)] lg:text-[clamp(9rem,13vw,13.5rem)]"
            >
              {ceremonyDayLabel}
            </span>
            <span
              ref={yearRef}
              className="block font-serif text-xl font-light tracking-[0.52em] text-burgundy-900/82 sm:text-2xl"
            >
              {ceremonyYear}
            </span>
          </div>

          <div className="relative mx-auto mt-7 grid max-w-lg grid-cols-3 gap-2 sm:gap-3">
            {dateParts.map((part, index) => (
              <div
                key={part.label}
                ref={(node) => {
                  detailRefs.current[index] = node;
                }}
                className="border border-bronze-500/24 bg-cream-50/54 px-2 py-3"
              >
                <p className="font-serif text-2xl leading-none text-burgundy-900 sm:text-3xl">
                  {part.value}
                </p>
                <p className="mt-2 text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-burgundy-900/48 sm:text-[0.62rem]">
                  {part.label}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mx-auto mt-7 flex max-w-md items-center justify-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-burgundy-900/55 sm:text-xs">
            <span
              ref={(node) => {
                lineRefs.current[2] = node;
              }}
              className="h-px flex-1 origin-right bg-bronze-500/45"
              aria-hidden
            />
            <span>{formattedDate}</span>
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
            className="relative mx-auto mt-7 max-w-xl text-pretty font-serif text-lg italic leading-relaxed text-burgundy-900/74 sm:text-xl md:text-2xl"
          >
            {t("dateBanner.tagline")}
          </p>

          <div className="relative mt-7 grid gap-2 text-left sm:grid-cols-3">
            {[
              ceremonyWeekday,
              `${t("dateDetails.timePrefix")} ${invitation.ceremony.time}`,
              `${t("dateDetails.lunarPrefix")} ${invitation.ceremony.lunarDate}`,
            ].map((item, index) => (
              <div
                key={item}
                ref={(node) => {
                  detailRefs.current[index + dateParts.length] = node;
                }}
                className="min-h-16 border-l border-bronze-500/45 bg-burgundy-600/[0.035] px-4 py-3"
              >
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-bronze-500">
                  0{index + 1}
                </p>
                <p className="mt-1 font-serif text-sm italic leading-snug text-burgundy-900/72 sm:text-base">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
