"use client";

import Link from "next/link";
import { Expand, Heart, ListMusic, Mic2, MoreHorizontal } from "lucide-react";
import { Artwork } from "@/components/ui/artwork";
import { PlayerControls } from "@/components/player/player-controls";
import { ProgressBar } from "@/components/player/progress-bar";
import { VolumeControl } from "@/components/player/volume-control";
import { SourceBadge } from "@/components/ui/source-badge";
import { usePlayerStore } from "@/lib/player/store";
import { cn } from "@/lib/utils";

export function MiniPlayer() {
  const track = usePlayerStore((state) => state.currentTrack);
  const favorites = usePlayerStore((state) => state.favorites);
  const toggleFavorite = usePlayerStore((state) => state.toggleFavorite);
  const toggleQueue = usePlayerStore((state) => state.toggleQueue);
  const playbackError = usePlayerStore((state) => state.playbackError);

  if (!track) return null;

  return (
    <aside className="glass fixed right-2 bottom-[76px] left-2 z-40 rounded-2xl px-2 py-2 shadow-2xl shadow-black/50 lg:right-3 lg:bottom-3 lg:left-[268px] lg:rounded-3xl lg:px-4">
      <div className="absolute inset-x-4 top-0 -translate-y-1/2 opacity-0 transition hover:opacity-100 lg:opacity-100">
        <ProgressBar showTimes={false} />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 lg:grid-cols-[minmax(220px,1fr)_minmax(280px,.8fr)_minmax(220px,1fr)]">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/player">
            <Artwork
              artwork={track.artwork}
              title={track.title}
              rounded="rounded-xl"
              className="size-12 shrink-0 lg:size-14"
            />
          </Link>
          <div className="min-w-0">
            <Link
              href="/player"
              className="block truncate text-sm font-semibold hover:text-violet-200"
            >
              {track.title}
            </Link>
            <p className="mt-0.5 truncate text-xs text-white/40">
              {track.artist}
            </p>
          </div>
          <SourceBadge source={track.source} compact />
          <button
            aria-label="Toggle favorite"
            onClick={() => toggleFavorite(track.id)}
            className={cn(
              "hidden rounded-full p-2 text-white/25 hover:text-white sm:block",
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
        </div>
        <PlayerControls minimal />
        <div className="hidden items-center justify-end gap-1 lg:flex">
          {playbackError && (
            <span className="max-w-40 truncate text-[10px] text-amber-300">
              {playbackError}
            </span>
          )}
          <Link
            href={`/lyrics/${track.id}`}
            aria-label="Open lyrics"
            className="rounded-full p-2 text-white/35 hover:bg-white/8 hover:text-white"
          >
            <Mic2 className="size-4" />
          </Link>
          <button
            aria-label="Open queue"
            onClick={toggleQueue}
            className="rounded-full p-2 text-white/35 hover:bg-white/8 hover:text-white"
          >
            <ListMusic className="size-4" />
          </button>
          <VolumeControl />
          <Link
            href="/player"
            aria-label="Open full player"
            className="rounded-full p-2 text-white/35 hover:bg-white/8 hover:text-white"
          >
            <Expand className="size-4" />
          </Link>
          <button
            aria-label="More options"
            className="rounded-full p-2 text-white/35 hover:bg-white/8 hover:text-white"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
