"use client";

import { useRef, useState } from "react";
import { Music2, Pause } from "lucide-react";

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
  };

  return (
    <>
      <audio ref={audioRef} src="/wedding-assets/music.mp3" loop preload="none" />
      <button
        type="button"
        aria-label={playing ? "Pause music" : "Play music"}
        onClick={toggle}
        className="grid h-12 w-12 place-items-center rounded-full border border-burgundy-900/30 bg-cream-50/70 text-burgundy-900 backdrop-blur transition hover:bg-cream-100"
      >
        {playing ? <Pause className="h-5 w-5" /> : <Music2 className="h-5 w-5" />}
      </button>
    </>
  );
}
