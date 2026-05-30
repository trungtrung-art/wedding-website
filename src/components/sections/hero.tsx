"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Leaf } from "lucide-react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { MusicToggle } from "@/components/music-toggle";

export function Hero() {
  const t = useT();
  const [opened, setOpened] = useState(false);

  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLButtonElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLSpanElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const sheet1Ref = useRef<HTMLDivElement>(null);
  const sheet2Ref = useRef<HTMLDivElement>(null);
  const sheet3Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leftSprigRef = useRef<HTMLSpanElement>(null);
  const rightSprigRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Initial states + reduced-motion handling
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set([backRef.current, sheet1Ref.current, sheet2Ref.current, sheet3Ref.current, cardRef.current, leftSprigRef.current, rightSprigRef.current, hintRef.current], {
        autoAlpha: 1, x: 0, y: 0, rotate: 0,
      });
      gsap.set([closedRef.current, sealRef.current], { autoAlpha: 0 });
      setOpened(true);
      return;
    }

    gsap.set(backRef.current, { autoAlpha: 0 });
    gsap.set([sheet1Ref.current, sheet3Ref.current], { autoAlpha: 0, y: 60, scale: 0.95 });
    gsap.set(sheet2Ref.current, { autoAlpha: 0, y: 80, scale: 0.95 });
    gsap.set(cardRef.current, { autoAlpha: 0, y: 100, rotate: -3 });
    gsap.set(leftSprigRef.current, { autoAlpha: 0, x: 50, y: 30, rotate: -28 });
    gsap.set(rightSprigRef.current, { autoAlpha: 0, x: -50, y: 30, rotate: 28 });
    gsap.set(hintRef.current, { autoAlpha: 0, y: 18 });
  }, []);

  // Scroll-driven fade on the envelope as you leave the hero
  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(shellRef.current, {
        y: -80, opacity: 0.45, ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const open = () => {
    if (opened) {
      document.getElementById("date-banner")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => setOpened(true),
    });

    tl
      // 1. Envelope rises slightly — anticipation
      .to(shellRef.current, { y: -14, scale: 1.025, duration: 0.5 })
      // 2. Wax seal "breaks" — scales down, rotates, fades
      .to(sealRef.current, {
        scale: 0.55, rotate: 22, autoAlpha: 0,
        duration: 0.55, ease: "back.in(1.6)",
      }, "-=0.1")
      // 3. Flap peels back (long, deliberate)
      .to(flapRef.current, {
        rotateX: -178, y: -3, duration: 1.05, ease: "power4.inOut",
      }, "-=0.45")
      // 4. Inner back wall fades in (envelope is now open)
      .to(backRef.current, { autoAlpha: 1, duration: 0.5 }, "-=0.55")
      // 5. Closed-envelope graphic fades out as opening reveals
      .to(closedRef.current, { autoAlpha: 0, duration: 0.55 }, "-=0.45")
      // 6. THREE photo sheets fan out from inside the envelope
      .to(sheet1Ref.current, {
        autoAlpha: 1, y: -38, x: -42, rotate: -9, scale: 1, duration: 0.95,
      }, "-=0.3")
      .to(sheet3Ref.current, {
        autoAlpha: 1, y: -38, x: 42, rotate: 9, scale: 1, duration: 0.95,
      }, "<")
      .to(sheet2Ref.current, {
        autoAlpha: 1, y: -56, scale: 1, duration: 0.95,
      }, "<+0.08")
      // 7. Main SAVE THE DATE card slides up on top
      .to(cardRef.current, {
        autoAlpha: 1, y: -78, rotate: 0, duration: 1.1, ease: "power3.out",
      }, "<+0.2")
      // 8. Floral sprigs glide in from corners
      .to([leftSprigRef.current, rightSprigRef.current], {
        autoAlpha: 1, x: 0, y: 0, rotate: 0, stagger: 0.12, duration: 0.85,
      }, "-=0.7")
      // 9. Intro names lift slightly to make room
      .to(introRef.current, { y: -28, duration: 0.6 }, "-=0.55")
      // 10. Scroll hint reveals at bottom
      .to(hintRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.2");
  };

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-between gap-10 px-5 py-10 text-center"
    >
      {/* Intro: couple names */}
      <div ref={introRef} className="space-y-5">
        <p className="text-xs font-medium uppercase tracking-[0.42em] text-burgundy-900/70">
          {t("hero.kicker")}
        </p>
        <div className="space-y-1">
          <h1 className="couple-name text-7xl leading-none text-burgundy-900 md:text-9xl">
            {invitation.couple.groom.name}
          </h1>
          <p className="couple-connector text-6xl leading-none text-bronze-500 md:text-8xl">&amp;</p>
          <h2 className="couple-name text-7xl leading-none text-burgundy-900 md:text-9xl">
            {invitation.couple.bride.name}
          </h2>
        </div>
      </div>

      {/* Envelope stage */}
      <button
        ref={shellRef}
        type="button"
        aria-label={opened ? t("hero.scrollHint") : t("hero.tagline")}
        aria-expanded={opened}
        onClick={open}
        className="group relative grid place-items-center transition-transform duration-300 ease-out hover:scale-[1.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-600/50 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50"
        style={{ width: "clamp(260px, 38vw, 400px)", aspectRatio: "3/4" }}
      >
        {/* Inner-back wall of envelope (revealed when opened) */}
        <Image
          ref={backRef}
          src="/wedding-assets/layer-envelope-back.png"
          alt=""
          width={694}
          height={799}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain"
          aria-hidden
        />

        {/* Left photo sheet (gallery[0]) — fans out to the left */}
        <div
          ref={sheet1Ref}
          className="paper-panel pointer-events-none absolute left-[6%] top-[18%] z-30 aspect-square w-[42%] origin-bottom overflow-hidden p-1.5"
        >
          <Image
            src={invitation.photos.gallery[0]}
            alt="Wedding moment 1"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right photo sheet (gallery[2]) — fans out to the right */}
        <div
          ref={sheet3Ref}
          className="paper-panel pointer-events-none absolute right-[6%] top-[18%] z-30 aspect-square w-[42%] origin-bottom overflow-hidden p-1.5"
        >
          <Image
            src={invitation.photos.gallery[2]}
            alt="Wedding moment 3"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Center photo sheet (gallery[1]) — peeks slightly higher than the two side sheets */}
        <div
          ref={sheet2Ref}
          className="paper-panel pointer-events-none absolute left-1/2 top-[13%] z-40 aspect-square w-[50%] -translate-x-1/2 origin-bottom overflow-hidden p-1.5"
        >
          <Image
            src={invitation.photos.gallery[1]}
            alt="Wedding moment 2"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Main SAVE THE DATE card — top layer */}
        <div
          ref={cardRef}
          className="paper-panel pointer-events-none absolute left-1/2 top-[16%] z-50 flex aspect-[3/4] w-[60%] -translate-x-1/2 flex-col items-center justify-center bg-cream-50 px-3 py-4"
        >
          <span className="text-[0.55rem] uppercase tracking-[0.42em] text-burgundy-900/60">
            {invitation.couple.initials}
          </span>
          <span className="mt-1 font-serif text-2xl font-light uppercase leading-none text-burgundy-900">
            {t("hero.saveTheDateLine1")}
          </span>
          <span className="mt-0.5 font-serif text-2xl font-light uppercase leading-none text-burgundy-900">
            {t("hero.saveTheDateLine2")}
          </span>
          <div className="mt-2 h-[42%] w-full overflow-hidden">
            <Image
              src={invitation.photos.hero}
              alt=""
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="mt-2 text-[0.55rem] uppercase tracking-[0.28em] text-burgundy-900/70">
            {invitation.ceremony.solarDate}
          </span>
        </div>

        {/* Closed-envelope graphic — the front face you see before clicking */}
        <div
          ref={closedRef}
          className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
        >
          <Image
            src="/wedding-assets/closed-envelope.png"
            alt=""
            width={800}
            height={1100}
            priority
            className="h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(45,34,24,0.32)]"
          />
        </div>

        {/* Flap — animates open. Stays on top of closed graphic until click. */}
        <span
          ref={flapRef}
          className="envelope-flap z-30"
          aria-hidden
        />

        {/* Wax seal — sits on top of flap edge */}
        <span
          ref={sealRef}
          className="pointer-events-none absolute z-40 h-20 w-20 md:h-24 md:w-24"
          style={{ top: "32%", left: "50%", transform: "translate(-50%, -50%)" }}
          aria-hidden
        >
          <Image
            src="/wedding-assets/seal-tq.svg"
            alt=""
            width={400}
            height={400}
            className="h-full w-full"
          />
        </span>

        {/* Floral sprigs */}
        <span
          ref={leftSprigRef}
          className="pointer-events-none absolute -left-6 bottom-[28%] z-50 h-16 w-16 text-bronze-500/85"
          aria-hidden
        >
          <Leaf
            className="h-full w-full"
            strokeWidth={1.1}
            style={{ transform: "rotate(-30deg)" }}
          />
        </span>
        <span
          ref={rightSprigRef}
          className="pointer-events-none absolute -right-6 bottom-[28%] z-50 h-16 w-16 text-bronze-500/85"
          aria-hidden
        >
          <Leaf
            className="h-full w-full"
            strokeWidth={1.1}
            style={{ transform: "rotate(30deg) scaleX(-1)" }}
          />
        </span>

        {/* Status text */}
        <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.34em] text-burgundy-900/75">
          {opened ? t("hero.scrollHint") : t("hero.tagline")}
        </span>
      </button>

      {/* Music toggle + scroll hint */}
      <div ref={hintRef} className="flex flex-col items-center gap-5">
        <MusicToggle />
        <ChevronDown
          className="h-8 w-8 animate-bounce text-burgundy-900/60"
          strokeWidth={1.4}
        />
      </div>
    </section>
  );
}
