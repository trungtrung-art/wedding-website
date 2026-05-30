"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  ChevronDown,
  Heart,
  MapPin,
  Music2,
  Pause,
  Play,
} from "lucide-react";
import { getCountdownParts, type CountdownParts } from "@/lib/countdown";

const invitation = {
  bride: "Emma",
  groom: "Lucas",
  initials: "E L",
  date: "07.17.2027",
  month: "July 2027",
  day: "17",
  city: "Los Angeles, California",
  rsvpBy: "January 15",
  targetDate: new Date("2027-07-17T17:00:00-07:00"),
};

const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);

function Countdown() {
  const [parts, setParts] = useState<CountdownParts>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => setParts(getCountdownParts(invitation.targetDate));

    update();
    const timer = window.setInterval(update, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 text-center text-white md:gap-7">
      {[
        ["days", parts.days],
        ["hours", parts.hours],
        ["minutes", parts.minutes],
        ["seconds", parts.seconds],
      ].map(([label, value]) => (
        <div key={label} className="min-w-16">
          <div className="font-serif text-3xl font-light tabular-nums md:text-5xl">
            {String(value).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[0.62rem] uppercase tracking-[0.28em] text-parchment/75">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function WeddingStage() {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const shellRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<HTMLSpanElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const closedEnvelopeRef = useRef<HTMLSpanElement>(null);
  const openEnvelopeRef = useRef<HTMLDivElement>(null);
  const leftFloralRef = useRef<HTMLSpanElement>(null);
  const rightFloralRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([cardRef.current, leftFloralRef.current, rightFloralRef.current], {
        autoAlpha: 1,
        y: 0,
        rotate: 0,
      });
      setOpened(true);
      return;
    }

    gsap.set(openEnvelopeRef.current, { autoAlpha: 0, scale: 0.96 });
    gsap.set(cardRef.current, { autoAlpha: 0, y: 95, rotate: -4 });
    gsap.set(leftFloralRef.current, { autoAlpha: 0, x: 42, y: 36, rotate: -18 });
    gsap.set(rightFloralRef.current, { autoAlpha: 0, x: -42, y: 36, rotate: 18 });
    gsap.set(hintRef.current, { autoAlpha: 0, y: 18 });
  }, []);

  const openInvitation = () => {
    if (opened) {
      document.getElementById("invitation-details")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => setOpened(true),
    });

    timeline
      .to(shellRef.current, { y: -10, scale: 1.02, duration: 0.32 })
      .to(flapRef.current, { rotateX: -162, y: -2, duration: 0.9, ease: "power4.inOut" }, "-=0.08")
      .to(closedEnvelopeRef.current, { autoAlpha: 0, scale: 0.96, duration: 0.58 }, "-=0.72")
      .to(openEnvelopeRef.current, { autoAlpha: 1, scale: 1, duration: 0.7 }, "-=0.58")
      .to(sealRef.current, { scale: 0.55, autoAlpha: 0, duration: 0.42 }, "-=0.52")
      .to(cardRef.current, { autoAlpha: 1, y: -54, rotate: 0, duration: 1.05 }, "-=0.45")
      .to(
        [leftFloralRef.current, rightFloralRef.current],
        { autoAlpha: 1, x: 0, y: 0, rotate: 0, stagger: 0.08, duration: 0.72 },
        "-=0.82"
      )
      .to(introRef.current, { y: -24, duration: 0.55 }, "-=0.48")
      .to(hintRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.12");
  };

  return (
    <main className="wedding-canvas relative min-h-screen overflow-x-hidden text-center">
      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-between px-5 py-8">
        <div ref={introRef} className="space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.42em] text-parchment/90">
            You have an invitation from
          </p>

          <div className="space-y-1">
            <h1 className="couple-name text-7xl leading-none text-white md:text-9xl">
              {invitation.bride}
            </h1>
            <p className="couple-connector text-6xl leading-none text-champagne md:text-8xl">
              and
            </p>
            <h2 className="couple-name text-7xl leading-none text-white md:text-9xl">
              {invitation.groom}
            </h2>
          </div>
        </div>

        <button
          ref={shellRef}
          className="envelope group"
          type="button"
          aria-label={opened ? "Scroll to wedding invitation details" : "Open wedding invitation"}
          aria-expanded={opened}
          onClick={openInvitation}
        >
          <span
            ref={closedEnvelopeRef}
            className="closed-letter"
            aria-hidden="true"
          />
          <div ref={openEnvelopeRef} className="letter-open-stage" aria-hidden="true">
            <Image
              className="letter-layer letter-back"
              src="/wedding-assets/layer-envelope-back.png"
              alt=""
              width={694}
              height={799}
            />
            <div ref={cardRef} className="invitation-card">
              <span className="text-[0.68rem] uppercase tracking-[0.44em] text-moss-700/70">
                {invitation.initials}
              </span>
              <span className="mt-2 font-serif text-4xl font-light uppercase text-moss-900">
                Save
              </span>
              <span className="-mt-2 font-serif text-4xl font-light uppercase text-moss-900">
                Date
              </span>
              <span className="mt-2 text-[0.64rem] uppercase tracking-[0.24em] text-moss-700/75">
                {invitation.date}
              </span>
              <Image
                className="photo-window"
                src="/wedding-assets/photo-detail-2.png"
                alt={`${invitation.bride} and ${invitation.groom} wedding portrait`}
                width={800}
                height={800}
              />
            </div>
            <Image
              className="letter-layer letter-front"
              src="/wedding-assets/layer-envelope-front.png"
              alt=""
              width={1122}
              height={1402}
            />
          </div>
          <span ref={flapRef} className="envelope-flap" />
          <span ref={leftFloralRef} className="floral-sprig floral-sprig-left" />
          <span ref={rightFloralRef} className="floral-sprig floral-sprig-right" />
          <span ref={sealRef} className="wax-seal">
            <Heart className="h-8 w-8" strokeWidth={1.45} />
          </span>
          <span className="absolute bottom-8 text-xs font-semibold uppercase tracking-[0.34em] text-moss-700">
            {opened ? "Scroll for details" : "Click envelope to open"}
          </span>
        </button>

        <div ref={hintRef} className="flex flex-col items-center gap-5">
          <button
            className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            type="button"
            aria-label={musicPlaying ? "Pause music" : "Play music"}
            onClick={() => setMusicPlaying((value) => !value)}
          >
            {musicPlaying ? (
              <Pause className="h-5 w-5" strokeWidth={1.7} />
            ) : (
              <Music2 className="h-5 w-5" strokeWidth={1.7} />
            )}
          </button>
          <ChevronDown className="h-8 w-8 animate-bounce text-white/75" strokeWidth={1.4} />
        </div>
      </section>

      <section
        id="invitation-details"
        className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20"
      >
        <div className="paper-panel max-w-xl px-8 py-12 md:px-14">
          <div className="mx-auto mb-8 overflow-hidden border border-white/70 bg-white/30 p-2 shadow-2xl">
            <Image
              className="h-56 w-full object-cover grayscale-[8%] sepia-[22%] md:h-72"
              src="/wedding-assets/photo-detail-2.png"
              alt={`${invitation.bride} and ${invitation.groom}`}
              width={800}
              height={800}
            />
          </div>
          <Play className="mx-auto h-12 w-12 rounded-full bg-champagne/80 p-3 text-white" />
          <p className="mt-8 text-xs uppercase tracking-[0.42em] text-moss-700">Save the date</p>
          <h2 className="mt-4 font-serif text-6xl font-light uppercase text-moss-900 md:text-8xl">
            {invitation.month}
          </h2>
          <p className="mt-3 font-serif text-3xl italic text-moss-700">for our wedding</p>
          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-moss-700/75">
            {invitation.date}
          </p>
        </div>
      </section>

      <section className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20">
        <div className="space-y-10">
          <div className="mx-auto grid max-w-sm grid-cols-7 gap-4 font-serif text-2xl text-white md:max-w-md md:text-3xl">
            {calendarDays.map((day) => (
              <span
                key={day}
                className={
                  day === Number(invitation.day)
                    ? "grid aspect-square place-items-center rounded-full border border-champagne text-champagne"
                    : "grid aspect-square place-items-center"
                }
              >
                {day}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4 text-parchment">
            <Image
              className="h-16 w-16 object-contain"
              src="/wedding-assets/petal-photo.png"
              alt=""
              width={800}
              height={533}
              aria-hidden="true"
            />
            <MapPin className="h-8 w-8 text-champagne" strokeWidth={1.25} />
            <p className="text-sm uppercase tracking-[0.34em]">{invitation.city}</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20">
        <div className="grid w-full max-w-4xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="text-left">
            <p className="font-serif text-7xl font-light uppercase leading-none text-white md:text-8xl">
              RSVP
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.38em] text-champagne">
              By {invitation.rsvpBy}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-7 text-parchment/85">
              Your presence would mean the world to us. Please confirm your attendance by
              completing the form.
            </p>
          </div>
          <div className="rsvp-card">
            <label className="text-left text-sm font-medium text-moss-900" htmlFor="guest-name">
              Your Name
            </label>
            <input id="guest-name" placeholder="Enter your name" />
            <label className="mt-5 text-left text-sm font-medium text-moss-900" htmlFor="guest-note">
              Message
            </label>
            <textarea id="guest-note" placeholder="Leave a note for the couple" rows={4} />
            <button type="button">Send RSVP</button>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20">
        <div className="space-y-8">
          <p className="font-serif text-5xl italic text-white md:text-7xl">the</p>
          <h2 className="font-serif text-5xl font-light uppercase tracking-[0.18em] text-white md:text-7xl">
            Countdown
          </h2>
          <p className="text-xs uppercase tracking-[0.42em] text-parchment/75">
            to forever has begun
          </p>
          <Countdown />
        </div>
      </section>

      <section className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20">
        <div className="space-y-8">
          <div className="monogram mx-auto">{invitation.initials.replace(" ", "&")}</div>
          <p className="font-serif text-4xl font-light uppercase tracking-[0.34em] text-white md:text-5xl">
            {invitation.bride} & {invitation.groom}
          </p>
          <p className="font-serif text-6xl italic text-white md:text-8xl">Thank you</p>
          <p className="font-serif text-2xl italic tracking-[0.1em] text-parchment">
            Formal invitation to follow
          </p>
        </div>
      </section>

      <p className="sr-only">
        Save the date for {invitation.bride} and {invitation.groom} on {invitation.date} in{" "}
        {invitation.city}.
      </p>
    </main>
  );
}
