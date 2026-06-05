"use client";

import { useEffect, useRef } from "react";
import type { LyricLine } from "@/lib/types";
import { activeLyricIndex } from "@/lib/lyrics/lrc";
import { usePlayerStore } from "@/lib/player/store";
import { cn } from "@/lib/utils";

export function SyncedLyrics({
  lines,
  offset = 0,
  karaokeGlow = true,
  onLineClick,
}: {
  lines: LyricLine[];
  offset?: number;
  karaokeGlow?: boolean;
  onLineClick?: (time: number) => void;
}) {
  const time = usePlayerStore((state) => state.currentTime);
  const seek = usePlayerStore((state) => state.seek);
  const active = activeLyricIndex(lines, time, offset);
  const lineRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    lineRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [active]);

  return (
    <div className="no-scrollbar h-full overflow-y-auto px-1 py-[35vh]">
      <div className="space-y-6">
        {lines.map((line, index) => {
          const distance = Math.abs(active - index);
          return (
            <button
              key={line.id}
              ref={(element) => {
                lineRefs.current[index] = element;
              }}
              onClick={() => {
                seek(Math.max(0, line.time - offset / 1000));
                onLineClick?.(line.time);
              }}
              className={cn(
                "block w-full text-left text-2xl leading-tight font-bold tracking-[-0.035em] transition-all duration-500 md:text-4xl xl:text-5xl",
                index === active
                  ? "translate-x-2 text-white opacity-100"
                  : distance === 1
                    ? "text-white/35"
                    : "text-white/15 hover:text-white/45",
                index === active &&
                  karaokeGlow &&
                  "drop-shadow-[0_0_22px_rgba(255,255,255,.28)]",
              )}
            >
              {line.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
