"use client";

import Link from "next/link";
import { Heart, MoreHorizontal, Pause, Play } from "lucide-react";
import { Artwork } from "@/components/ui/artwork";
import { SourceBadge } from "@/components/ui/source-badge";
import { usePlayerStore } from "@/lib/player/store";
import type { Track } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

export function TrackRow({
  track,
  queue,
  index,
}: {
  track: Track;
  queue?: Track[];
  index?: number;
}) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const togglePlayback = usePlayerStore((state) => state.togglePlayback);
  const favorites = usePlayerStore((state) => state.favorites);
  const toggleFavorite = usePlayerStore((state) => state.toggleFavorite);
  const active = currentTrack?.id === track.id;

  return (
    <div
      className={cn(
        "group grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-white/6 md:grid-cols-[36px_minmax(0,1.4fr)_minmax(120px,.8fr)_80px_auto]",
        active && "bg-white/7",
      )}
    >
      <button
        aria-label={`${active && isPlaying ? "Pause" : "Play"} ${track.title}`}
        onClick={() => (active ? togglePlayback() : playTrack(track, queue))}
        className="grid size-8 place-items-center rounded-lg text-xs text-white/35 hover:bg-white/8 hover:text-white"
      >
        {active && isPlaying ? (
          <Pause className="size-4 fill-current" />
        ) : (
          <>
            <span className="group-hover:hidden">
              {index != null ? index + 1 : ""}
            </span>
            <Play className="hidden size-4 fill-current group-hover:block" />
          </>
        )}
      </button>
      <div className="flex min-w-0 items-center gap-3">
        <Artwork
          artwork={track.artwork}
          title={track.title}
          rounded="rounded-lg"
          className="size-11 shrink-0"
        />
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-medium",
              active && "text-violet-300",
            )}
          >
            {track.title}
          </p>
          <Link
            href={`/artist/${track.artistId}`}
            className="mt-0.5 block truncate text-xs text-white/40 hover:text-white/70"
          >
            {track.artist}
          </Link>
        </div>
      </div>
      <Link
        href={`/album/${track.albumId}`}
        className="hidden truncate text-xs text-white/35 hover:text-white/65 md:block"
      >
        {track.album}
      </Link>
      <div className="hidden items-center gap-2 md:flex">
        <SourceBadge source={track.source} compact />
        <span className="text-xs text-white/35 tabular-nums">
          {formatTime(track.duration)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          aria-label={
            favorites.includes(track.id)
              ? "Remove from favorites"
              : "Add to favorites"
          }
          onClick={() => toggleFavorite(track.id)}
          className={cn(
            "rounded-lg p-2 text-white/25 hover:bg-white/8 hover:text-white",
            favorites.includes(track.id) && "text-pink-400",
          )}
        >
          <Heart
            className={cn(
              "size-4",
              favorites.includes(track.id) && "fill-current",
            )}
          />
        </button>
        <button
          aria-label="More options"
          className="hidden rounded-lg p-2 text-white/25 hover:bg-white/8 hover:text-white sm:block"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </div>
  );
}
