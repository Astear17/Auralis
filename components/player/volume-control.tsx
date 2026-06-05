"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/lib/player/store";

export function VolumeControl({ compact = false }: { compact?: boolean }) {
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const Icon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2">
      <button
        aria-label={volume === 0 ? "Unmute" : "Mute"}
        onClick={() => setVolume(volume === 0 ? 0.72 : 0)}
        className="rounded-full p-2 text-white/45 hover:bg-white/8 hover:text-white"
      >
        <Icon className="size-4" />
      </button>
      {!compact && (
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="range w-20"
          style={{
            background: `linear-gradient(to right, white 0%, white ${volume * 100}%, rgba(255,255,255,.14) ${volume * 100}%)`,
          }}
        />
      )}
    </div>
  );
}
