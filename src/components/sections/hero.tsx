"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ChevronDown, Heart } from "lucide-react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { MusicToggle } from "@/components/music-toggle";

export function Hero() {
  const t = useT();
  const [opened, setOpened] = useState(false);

  const shellRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<HTMLSpanElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef<HTMLSpanElement>(null);
  const openRef = useRef<HTMLDivElement>(null);
  const leftFloralRef = useRef<HTMLSpanElement>(null);
  const rightFloralRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set([cardRef.current, leftFloralRef.current, rightFloralRef.current], {
        autoAlpha: 1, y: 0, rotate: 0,
      });
      setOpened(true);
      return;
    }
    gsap.set(openRef.current, { autoAlpha: 0, scale: 0.96 });
    gsap.set(cardRef.current, { autoAlpha: 0, y: 95, rotate: -4 });
    gsap.set(leftFloralRef.current, { autoAlpha: 0, x: 42, y: 36, rotate: -18 });
    gsap.set(rightFloralRef.current, { autoAlpha: 0, x: -42, y: 36, rotate: 18 });
    gsap.set(hintRef.current, { autoAlpha: 0, y: 18 });
  }, []);

  const open = () => {
    if (opened) {
      document.getElementById("date-banner")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => setOpened(true) });
    tl.to(shellRef.current, { y: -10, scale: 1.02, duration: 0.32 })
      .to(flapRef.current, { rotateX: -162, y: -2, duration: 0.9, ease: "power4.inOut" }, "-=0.08")
      .to(closedRef.current, { autoAlpha: 0, scale: 0.96, duration: 0.58 }, "-=0.72")
      .to(openRef.current, { autoAlpha: 1, scale: 1, duration: 0.7 }, "-=0.58")
      .to(sealRef.current, { scale: 0.55, autoAlpha: 0, duration: 0.42 }, "-=0.52")
      .to(cardRef.current, { autoAlpha: 1, y: -54, rotate: 0, duration: 1.05 }, "-=0.45")
      .to([leftFloralRef.current, rightFloralRef.current], { autoAlpha: 1, x: 0, y: 0, rotate: 0, stagger: 0.08, duration: 0.72 }, "-=0.82")
      .to(introRef.current, { y: -24, duration: 0.55 }, "-=0.48")
      .to(hintRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.12");
  };

  return (
    <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-between px-5 py-8 text-center">
      <div ref={introRef} className="space-y-5">
        <p className="text-xs font-medium uppercase tracking-[0.42em] text-burgundy-900/70">
          {t("hero.kicker")}
        </p>
        <div className="space-y-1">
          <h1 className="couple-name text-7xl leading-none text-burgundy-900 md:text-9xl">
            {invitation.couple.groom.name}
          </h1>
          <p className="couple-connector text-6xl leading-none text-bronze-500 md:text-8xl">&</p>
          <h2 className="couple-name text-7xl leading-none text-burgundy-900 md:text-9xl">
            {invitation.couple.bride.name}
          </h2>
        </div>
      </div>

      <button
        ref={shellRef}
        type="button"
        className="envelope group"
        aria-label={opened ? t("hero.scrollHint") : t("hero.tagline")}
        aria-expanded={opened}
        onClick={open}
      >
        <span ref={closedRef} className="closed-letter" aria-hidden />
        <div ref={openRef} className="letter-open-stage" aria-hidden>
          <Image className="letter-layer" src="/wedding-assets/layer-envelope-back.png" alt="" width={694} height={799} />
          <div ref={cardRef} className="invitation-card">
            <span className="text-[0.68rem] uppercase tracking-[0.44em] text-burgundy-900/60">
              {invitation.couple.initials}
            </span>
            <span className="mt-2 font-serif text-4xl font-light uppercase text-burgundy-900">
              {t("hero.saveTheDateLine1")}
            </span>
            <span className="-mt-2 font-serif text-4xl font-light uppercase text-burgundy-900">
              {t("hero.saveTheDateLine2")}
            </span>
            <Image className="photo-window" src={invitation.photos.hero} alt="" width={800} height={800} />
          </div>
          <Image className="letter-layer" src="/wedding-assets/layer-envelope-front.png" alt="" width={1122} height={1402} />
        </div>
        <span ref={flapRef} className="envelope-flap" />
        <span ref={leftFloralRef} className="floral-sprig floral-sprig-left" />
        <span ref={rightFloralRef} className="floral-sprig floral-sprig-right" />
        <span ref={sealRef} className="wax-seal">
          <Heart className="h-8 w-8" strokeWidth={1.45} />
        </span>
        <span className="absolute bottom-8 text-xs font-semibold uppercase tracking-[0.34em] text-burgundy-900/75">
          {opened ? t("hero.scrollHint") : t("hero.tagline")}
        </span>
      </button>

      <div ref={hintRef} className="flex flex-col items-center gap-5">
        <MusicToggle />
        <ChevronDown className="h-8 w-8 animate-bounce text-burgundy-900/60" strokeWidth={1.4} />
      </div>
    </section>
  );
}
