"use client";

import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import gsap from "gsap";
import { useT } from "@/lib/i18n-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

// Placeholder guest book entries. CMS REPLACEMENT: fetch from the future
// guest-messages endpoint and render the same shape.
const placeholderMessages = [
  { name: "Hà Linh", body: "Chúc hai bạn trăm năm hạnh phúc!" },
  { name: "Minh Quân", body: "Hạnh phúc trọn đời nhé hai bạn!" },
  { name: "Phương Anh", body: "Đẹp đôi quá! Chúc mừng!" },
  { name: "Thanh Hà", body: "Yêu hai bạn lắm — chúc hạnh phúc bền lâu." },
  { name: "Tuấn Khang", body: "Một đám cưới đáng nhớ đang chờ!" },
];

export function GuestInteraction() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const [heartCount, setHeartCount] = useState(127);
  useScrollReveal(ref, { childSelector: "[data-reveal]", stagger: 0.1 });

  const fireHearts = () => {
    setHeartCount((n) => n + 1);
    if (!burstRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heart = document.createElement("span");
    heart.innerHTML = "❤";
    heart.style.cssText =
      "position:absolute;left:50%;top:50%;color:#7a2d2d;font-size:24px;pointer-events:none";
    burstRef.current.appendChild(heart);

    gsap.fromTo(
      heart,
      { x: 0, y: 0, scale: 0.6, opacity: 1 },
      {
        x: (Math.random() - 0.5) * 200,
        y: -100 - Math.random() * 80,
        scale: 1.2,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => heart.remove(),
      }
    );
  };

  return (
    <section ref={ref} className="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-5 py-20">
      <div className="grid w-full gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div data-reveal>
          <h3 className="section-title mb-6 text-3xl uppercase tracking-[0.2em] text-burgundy-900 md:text-4xl">
            {t("guestInteraction.title")}
          </h3>
          <ul className="space-y-4">
            {placeholderMessages.map((m, i) => (
              <li key={i} className="paper-panel px-5 py-4 text-left">
                <p className="text-sm font-medium text-burgundy-900">{m.name}</p>
                <p className="mt-1 text-sm italic text-burgundy-900/70">{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal className="relative text-center">
          <div ref={burstRef} className="relative mx-auto h-32 w-32" />
          <button
            type="button"
            onClick={fireHearts}
            className="mx-auto inline-flex items-center gap-2 rounded-full bg-burgundy-600 px-6 py-3 text-sm uppercase tracking-[0.25em] text-cream-50 transition hover:bg-burgundy-900"
          >
            <Heart className="h-4 w-4" />
            {t("guestInteraction.heartsCta")}
          </button>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-burgundy-900/60">
            {heartCount} {t("guestInteraction.heartsCount")}
          </p>
        </div>
      </div>
    </section>
  );
}
