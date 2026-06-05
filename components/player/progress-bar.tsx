"use client";

import { usePlayerStore } from "@/lib/player/store";
import { formatTime } from "@/lib/utils";

export function ProgressBar({ showTimes = true }: { showTimes?: boolean }) {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);
  const seek = usePlayerStore((state) => state.seek);
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full">
      <input
        aria-label="Playback progress"
        type="range"
        min={0}
        max={duration || 1}
        step={0.1}
        value={Math.min(currentTime, duration || 1)}
        onChange={(event) => seek(Number(event.target.value))}
        className="range w-full"
        style={{
          background: `linear-gradient(to right, white 0%, white ${progress}%, rgba(255,255,255,.14) ${progress}%)`,
        }}
      />
      {showTimes && (
        <div className="mt-1 flex justify-between text-[10px] text-white/35 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      )}
    </div>
  );
}
