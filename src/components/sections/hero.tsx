"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { invitation } from "@/data/invitation";
import { useT } from "@/lib/i18n-context";
import { MusicToggle } from "@/components/music-toggle";
import { EnvelopeBody } from "@/components/envelope/EnvelopeBody";
import { EnvelopeTopFlap } from "@/components/envelope/EnvelopeTopFlap";
import { EnvelopeSeal } from "@/components/envelope/EnvelopeSeal";

export function Hero() {
  const t = useT();
  const [opened, setOpened] = useState(false);

  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLButtonElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  // Envelope: 4 stable pieces stay put as the "pocket", top flap hinges in 3D
  const envBodyRef = useRef<SVGRectElement>(null);
  const envLeftFlapRef = useRef<SVGPolygonElement>(null);
  const envRightFlapRef = useRef<SVGPolygonElement>(null);
  const envBottomFlapRef = useRef<SVGPolygonElement>(null);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);
  const sheet1Ref = useRef<HTMLDivElement>(null);
  const sheet2Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leftSprigRef = useRef<HTMLSpanElement>(null);
  const rightSprigRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Initial states + reduced-motion handling
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set([sheet1Ref.current, sheet2Ref.current, cardRef.current, leftSprigRef.current, rightSprigRef.current, hintRef.current], {
        autoAlpha: 1, x: 0, y: 0, rotate: 0,
      });
      gsap.set([sealRef.current], { autoAlpha: 0 });
      gsap.set(topFlapRef.current, { rotateX: -158 });
      setOpened(true);
      return;
    }

    // All cards/sheets start DEEP inside the envelope (high y offset puts
    // them near the bottom of the pocket). The animation timeline below
    // raises them out one by one so they visibly emerge from the envelope.
    gsap.set(cardRef.current, { autoAlpha: 0, y: 220, rotate: 0 });
    gsap.set([sheet1Ref.current, sheet2Ref.current], {
      autoAlpha: 0, y: 240, scale: 0.96, rotate: 0,
    });
    gsap.set(leftSprigRef.current, { autoAlpha: 0, x: 50, y: 30, rotate: -28 });
    gsap.set(rightSprigRef.current, { autoAlpha: 0, x: -50, y: 30, rotate: 28 });
    gsap.set(hintRef.current, { autoAlpha: 0, y: 18 });
    gsap.set(topFlapRef.current, { rotateX: 0 });
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
      .to(shellRef.current, { y: -14, duration: 0.2 })
      // 2. Wax seal "breaks"
      .to(sealRef.current, {
        scale: 0.55, rotate: 22, autoAlpha: 0,
        duration: 0.28, ease: "back.in(1.6)",
      }, "-=0.08")
      // 3. Top triangle flap hinges back in real 3D space
      .to(topFlapRef.current, {
        rotateX: -158, duration: 0.45, ease: "power3.inOut",
      }, "-=0.2")

      // 4. SAVE THE DATE card rises out of envelope
      .to(cardRef.current, {
        autoAlpha: 1, y: -260, rotate: 6,
        duration: 0.45, ease: "power2.out",
      }, "-=0.25")

      // 5. Photo 1 (LEFT) — rises so a good portion sits above envelope rim
      .to(sheet1Ref.current, {
        autoAlpha: 1, y: -200, x: 0, rotate: -8, scale: 1,
        duration: 0.4, ease: "power2.out",
      }, "-=0.1")

      // 6. Photo 2 (RIGHT) — rises to match, ~30% overlap with photo 1
      .to(sheet2Ref.current, {
        autoAlpha: 1, y: -200, x: 0, rotate: 8, scale: 1,
        duration: 0.4, ease: "power2.out",
      }, "-=0.28")

      // 8. Floral sprigs glide in
      .to([leftSprigRef.current, rightSprigRef.current], {
        autoAlpha: 1, x: 0, y: 0, rotate: 0, stagger: 0.05, duration: 0.3,
      }, "-=0.1")

      // 9. Scroll hint
      .to(hintRef.current, { autoAlpha: 1, y: 0, duration: 0.25 }, "-=0.15");
  };

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto flex min-h-screen max-w-screen-2xl flex-col items-center justify-between gap-8 px-6 py-8 text-center md:py-14"
    >
      {/* Intro: couple names */}
      <div ref={introRef} className="w-full space-y-5">
        <p className="text-xs font-medium uppercase tracking-[0.42em] text-burgundy-900/70">
          {t("hero.kicker")}
        </p>
        {/* Stepped layout with a precise meeting point: 2-column grid
            where the GROOM sits in column 1 right-aligned (so its last
            letter touches the column boundary at 50%) and the BRIDE sits
            in column 2 left-aligned (so its first letter starts at the
            same boundary). The "&" spans both columns text-centered, so
            it lands exactly on that 50% line. End of "Trung", the "&",
            and start of "Quỳnh" all align vertically at the middle. */}
        {/* Grid with auto-sized columns: each name's column is exactly as
            wide as the name's text (no 50/50 split that clips). The two
            columns share a boundary in the middle — that's where the
            "g" of Trung ends and the "Q" of Quỳnh starts. The ampersand
            col-spans both and text-centers, landing on that boundary. */}
        {/* Sizes calibrated to fit BOTH names side-by-side in each breakpoint's
            viewport: ~11-char names (Thiện Trung / Quỳnh Trang) at the font
            size need 2 × (chars × ~0.6 × font-size) ≤ viewport - padding.
            Capped at text-[7rem] on 2xl+ screens where it actually fits. */}
        <div className="grid w-full grid-cols-[max-content_max-content] items-baseline justify-center gap-y-2">
          <h1 className="couple-name col-start-1 col-end-2 whitespace-nowrap pr-3 text-right text-4xl leading-[0.95] text-burgundy-900 sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {invitation.couple.groom.name}
          </h1>
          <p className="couple-connector col-span-2 col-start-1 text-center text-3xl leading-none text-bronze-500 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            &amp;
          </p>
          <h2 className="couple-name col-start-2 col-end-3 whitespace-nowrap pl-3 text-left text-4xl leading-[0.95] text-burgundy-900 sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
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
        style={{
          width: "clamp(440px, 55vw, 720px)",
          aspectRatio: "4/3",
          perspective: "2200px",
          perspectiveOrigin: "center top",
          transformStyle: "preserve-3d",
        }}
      >

        {/* Two LARGER portrait photos with photo 2 (RIGHT) overlapping
            photo 1 (LEFT) by ~30% of photo width.
              sheet1 (left-[5%], w-[46%])  → spans  5 – 51%  from left
              sheet2 (right-[18%], w-[46%]) → spans 36 – 82%  from left
              overlap = 36–51% = 15% of envelope = 15/46 ≈ 33% of photo */}

        {/* Photo 1 — LEFT, gallery[0] */}
        <div
          ref={sheet1Ref}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute left-[11%] top-[18%] z-40 aspect-[3/4] w-[46%] origin-bottom overflow-hidden p-1.5"
        >
          <Image
            src={invitation.photos.gallery[0]}
            alt="Wedding moment 1"
            width={600}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Photo 2 — RIGHT, gallery[1] — z-[42] so it sits ON TOP of
            sheet1 in the ~30% overlap zone */}
        <div
          ref={sheet2Ref}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute right-[12%] top-[18%] z-[42] aspect-[3/4] w-[46%] origin-bottom overflow-hidden p-1.5"
        >
          <Image
            src={invitation.photos.gallery[1]}
            alt="Wedding moment 2"
            width={600}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Main SAVE THE DATE card — top layer */}
        {/* Card sits BEHIND the photos (z-[35] vs z-40/z-[45]) and rises
            out of the envelope on open (y: -110 in the animation timeline)
            so the T&Q / SAVE / DATE text ends up ABOVE the photos.
            The lower portion of the card stays inside the envelope
            pocket, hidden behind the photo sheets. */}
        <div
          ref={cardRef}
          style={{ opacity: 0 }}
          className="paper-panel pointer-events-none absolute left-[56%] top-[5%] z-[35] flex aspect-square w-[64%] -translate-x-1/2 flex-col items-center justify-start bg-cream-50 px-4 pt-6"
        >
          <span className="text-[0.7rem] uppercase tracking-[0.42em] text-burgundy-900/60">
            {invitation.couple.initials}
          </span>
          <span className="mt-2 font-serif text-3xl font-light uppercase leading-none text-burgundy-900 md:text-4xl">
            {t("hero.saveTheDateLine1")}
          </span>
          <span className="mt-1 font-serif text-3xl font-light uppercase leading-none text-burgundy-900 md:text-4xl">
            {t("hero.saveTheDateLine2")}
          </span>
          
        </div>

        {/* Envelope pocket — 4 stable pieces as flat SVG (body + L/R
            triangles + bottom trapezoid). These never move; they form
            the visible envelope from which the card emerges. */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <EnvelopeBody
            bodyRef={envBodyRef}
            leftFlapRef={envLeftFlapRef}
            rightFlapRef={envRightFlapRef}
            bottomFlapRef={envBottomFlapRef}
          />
        </div>

        <EnvelopeTopFlap ref={topFlapRef} />

        <EnvelopeSeal ref={sealRef} />

        {/* Botanical cutouts */}
        <span
          ref={leftSprigRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute left-[-13%] bottom-[20%] z-[41] h-96 w-60 sm:left-[-12%] sm:h-[28rem] sm:w-72 md:left-[-12%] md:bottom-[19%] md:h-[32rem] md:w-80"
          aria-hidden
        >
          <Image
            src="/wedding-assets/pampas-grass.png"
            alt=""
            width={512}
            height={768}
            className="absolute bottom-0 left-0 h-full w-[92%] object-contain"
            style={{ transform: "rotate(-12deg)" }}
          />
          <Image
            src="/wedding-assets/white-roses.png"
            alt=""
            width={512}
            height={768}
            className="absolute bottom-1 left-[14%] h-[62%] w-[90%] object-contain"
            style={{ transform: "rotate(-7deg)" }}
          />
        </span>
        <span
          ref={rightSprigRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute right-[-15%] bottom-[11%] z-[43] h-96 w-60 sm:right-[-15%] sm:h-[28rem] sm:w-72 md:right-[-16%] md:bottom-[10%] md:h-[32rem] md:w-80"
          aria-hidden
        >
          <Image
            src="/wedding-assets/pampas-grass.png"
            alt=""
            width={512}
            height={768}
            className="absolute bottom-8 right-0 h-[94%] w-[86%] object-contain"
            style={{ transform: "rotate(12deg) scaleX(-1)" }}
          />
          <Image
            src="/wedding-assets/white-roses.png"
            alt=""
            width={512}
            height={768}
            className="absolute bottom-0 right-[14%] h-[68%] w-[96%] object-contain"
            style={{ transform: "rotate(-4deg)" }}
          />
        </span>

        {/* Status text */}
        <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.34em] text-burgundy-900/75">
          {opened ? t("hero.scrollHint") : t("hero.tagline")}
        </span>
      </button>

      {/* Music toggle + scroll hint */}
      <div ref={hintRef} style={{ opacity: 0 }} className="flex flex-col items-center gap-5">
        <MusicToggle />
        <ChevronDown
          className="h-8 w-8 animate-bounce text-burgundy-900/60"
          strokeWidth={1.4}
        />
      </div>
    </section>
  );
}
