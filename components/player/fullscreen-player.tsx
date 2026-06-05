"use client";

import Link from "next/link";
import {
  Heart,
  ListMusic,
  Mic2,
  MoreHorizontal,
  RadioTower,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Artwork } from "@/components/ui/artwork";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PlayerControls } from "@/components/player/player-controls";
import { ProgressBar } from "@/components/player/progress-bar";
import { SourceBadge } from "@/components/ui/source-badge";
import { VolumeControl } from "@/components/player/volume-control";
import { usePlayerStore } from "@/lib/player/store";
import { cn } from "@/lib/utils";

export function FullscreenPlayer() {
  const track = usePlayerStore((state) => state.currentTrack);
  const favorites = usePlayerStore((state) => state.favorites);
  const toggleFavorite = usePlayerStore((state) => state.toggleFavorite);
  const toggleQueue = usePlayerStore((state) => state.toggleQueue);
  const playbackError = usePlayerStore((state) => state.playbackError);

  if (!track) return null;

  return (
    <div className="relative mx-auto min-h-[calc(100vh-10rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl md:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-25 blur-3xl"
        style={{
          background: `radial-gradient(circle at 25% 35%, ${track.artwork.accent}, transparent 40%), radial-gradient(circle at 80% 65%, ${track.artwork.primary}, transparent 44%)`,
        }}
      />
      <div className="relative grid min-h-[calc(100vh-14rem)] items-center gap-8 lg:grid-cols-[minmax(300px,1fr)_minmax(360px,.85fr)] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-[620px]"
        >
          <Artwork
            artwork={track.artwork}
            title={track.title}
            rounded="rounded-[2rem]"
            className="w-full shadow-2xl shadow-black/60"
          />
        </motion.div>
        <div className="mx-auto w-full max-w-xl">
          <div className="flex items-center gap-2">
            <SourceBadge source={track.source} />
            <span className="text-xs text-white/35">
              {track.year} · {track.genres.join(" · ")}
            </span>
          </div>
          <h1 className="mt-5 text-4xl leading-tight font-bold tracking-[-0.04em] text-balance md:text-6xl">
            {track.title}
          </h1>
          <Link
            href={`/artist/${track.artistId}`}
            className="mt-3 inline-block text-lg text-white/50 hover:text-white"
          >
            {track.artist}
          </Link>
          <div
            id="youtube-player-slot"
            suppressHydrationWarning
            className={track.source === "youtube" ? "mt-6" : "hidden"}
          />
          <div className="mt-8">
            <ProgressBar />
          </div>
          <div className="mt-5">
            <PlayerControls large />
          </div>
          <div className="mt-7 flex items-center justify-between border-t border-white/8 pt-5">
            <VolumeControl />
            <div className="flex items-center gap-1">
              <button
                aria-label="Toggle favorite"
                onClick={() => toggleFavorite(track.id)}
                className={cn(
                  "rounded-full p-2.5 text-white/40 hover:bg-white/8 hover:text-white",
                  favorites.includes(track.id) && "text-pink-400",
                )}
              >
                <Heart
                  className={cn(
                    "size-5",
                    favorites.includes(track.id) && "fill-current",
                  )}
                />
              </button>
              <Link
                href={`/lyrics/${track.id}`}
                aria-label="Open lyrics"
                className="rounded-full p-2.5 text-white/40 hover:bg-white/8 hover:text-white"
              >
                <Mic2 className="size-5" />
              </Link>
              <button
                aria-label="Open queue"
                onClick={toggleQueue}
                className="rounded-full p-2.5 text-white/40 hover:bg-white/8 hover:text-white"
              >
                <ListMusic className="size-5" />
              </button>
              <button
                aria-label="Share"
                className="rounded-full p-2.5 text-white/40 hover:bg-white/8 hover:text-white"
              >
                <Share2 className="size-5" />
              </button>
              <button
                aria-label="More options"
                className="rounded-full p-2.5 text-white/40 hover:bg-white/8 hover:text-white"
              >
                <MoreHorizontal className="size-5" />
              </button>
            </div>
          </div>
          {track.source === "youtube" && (
            <GlassPanel className="mt-5 flex items-start gap-3 rounded-2xl p-4 text-xs leading-5 text-white/45">
              <RadioTower className="mt-0.5 size-4 shrink-0 text-red-300" />
              YouTube playback stays in the visible official player. Auralis
              does not remove ads or change YouTube or Premium restrictions.
            </GlassPanel>
          )}
          {playbackError && (
            <p className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/8 px-4 py-3 text-xs text-amber-200">
              {playbackError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
