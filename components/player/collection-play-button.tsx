"use client";

import { Play } from "lucide-react";
import { usePlayerStore } from "@/lib/player/store";
import type { Track } from "@/lib/types";

export function CollectionPlayButton({
  tracks,
  label = "Play",
}: {
  tracks: Track[];
  label?: string;
}) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  return (
    <button
      disabled={!tracks.length}
      onClick={() => tracks[0] && playTrack(tracks[0], tracks)}
      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-xl shadow-black/20 hover:bg-white/90 disabled:opacity-40"
    >
      <Play className="size-4 fill-current" /> {label}
    </button>
  );
}
