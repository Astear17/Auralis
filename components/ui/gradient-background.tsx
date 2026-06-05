"use client";

import { usePlayerStore } from "@/lib/player/store";

export function GradientBackground() {
  const artwork = usePlayerStore((state) => state.currentTrack?.artwork);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05060a]">
      <div
        className="animate-float-slow absolute -top-1/3 left-1/4 h-[70vw] w-[70vw] rounded-full opacity-20 blur-[140px] transition-colors duration-1000"
        style={{ backgroundColor: artwork?.primary ?? "#312e81" }}
      />
      <div
        className="animate-float-slow absolute right-0 -bottom-1/3 h-[55vw] w-[55vw] rounded-full opacity-15 blur-[150px] transition-colors duration-1000 [animation-delay:-5s]"
        style={{ backgroundColor: artwork?.accent ?? "#0e7490" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,6,10,.4),#05060a_75%)]" />
    </div>
  );
}
