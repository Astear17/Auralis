"use client";

import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { usePlayerStore } from "@/lib/player/store";
import { cn } from "@/lib/utils";

export function PlayerControls({
  large = false,
  minimal = false,
}: {
  large?: boolean;
  minimal?: boolean;
}) {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlayback = usePlayerStore((state) => state.togglePlayback);
  const nextTrack = usePlayerStore((state) => state.nextTrack);
  const previousTrack = usePlayerStore((state) => state.previousTrack);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const repeat = usePlayerStore((state) => state.repeat);
  const cycleRepeat = usePlayerStore((state) => state.cycleRepeat);
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className="flex items-center justify-center gap-2">
      {!minimal && (
        <button
          aria-label="Toggle shuffle"
          onClick={toggleShuffle}
          className={cn(
            "rounded-full p-2.5 text-white/35 hover:bg-white/8 hover:text-white",
            shuffle && "text-violet-300",
          )}
        >
          <Shuffle className={cn(large ? "size-5" : "size-4")} />
        </button>
      )}
      <button
        aria-label="Previous track"
        onClick={previousTrack}
        className="rounded-full p-2.5 text-white/65 hover:bg-white/8 hover:text-white"
      >
        <SkipBack className={cn("fill-current", large ? "size-6" : "size-4")} />
      </button>
      <button
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={togglePlayback}
        className={cn(
          "grid place-items-center rounded-full bg-white text-black shadow-xl shadow-black/20 transition hover:scale-105",
          large ? "size-16" : "size-10",
        )}
      >
        {isPlaying ? (
          <Pause className={cn("fill-current", large ? "size-7" : "size-4")} />
        ) : (
          <Play
            className={cn("ml-0.5 fill-current", large ? "size-7" : "size-4")}
          />
        )}
      </button>
      <button
        aria-label="Next track"
        onClick={nextTrack}
        className="rounded-full p-2.5 text-white/65 hover:bg-white/8 hover:text-white"
      >
        <SkipForward
          className={cn("fill-current", large ? "size-6" : "size-4")}
        />
      </button>
      {!minimal && (
        <button
          aria-label="Cycle repeat mode"
          onClick={cycleRepeat}
          className={cn(
            "relative rounded-full p-2.5 text-white/35 hover:bg-white/8 hover:text-white",
            repeat !== "off" && "text-violet-300",
          )}
        >
          <RepeatIcon className={cn(large ? "size-5" : "size-4")} />
        </button>
      )}
    </div>
  );
}
