"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Artwork } from "@/components/ui/artwork";
import { SourceBadge } from "@/components/ui/source-badge";
import { featuredTrack, mockTracks } from "@/lib/mock-data";
import { usePlayerStore } from "@/lib/player/store";

export function HeroSection() {
  const playTrack = usePlayerStore((state) => state.playTrack);
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-5 py-7 shadow-2xl shadow-black/20 backdrop-blur-2xl md:px-9 md:py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: `radial-gradient(circle at 75% 25%, ${featuredTrack.artwork.accent}, transparent 30%), linear-gradient(135deg, ${featuredTrack.artwork.primary}, transparent 55%)`,
        }}
      />
      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(260px,.55fr)]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-pink-200 uppercase">
            <Sparkles className="size-3.5" /> Featured release
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl leading-[0.95] font-bold tracking-[-0.055em] text-balance md:text-7xl xl:text-8xl">
            Hear the color after midnight.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/50 md:text-base">
            A complete music home for discovery, synced lyrics, official embeds,
            and the audio files that are already yours.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => playTrack(featuredTrack, mockTracks)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-xl shadow-black/20 transition hover:scale-[1.02]"
            >
              <Play className="size-4 fill-current" /> Play Afterlight
            </button>
            <Link
              href={`/album/${featuredTrack.albumId}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-5 py-3 text-sm font-semibold text-white/70 hover:bg-white/12 hover:text-white"
            >
              Explore album <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-3 text-xs text-white/35">
            <SourceBadge source={featuredTrack.source} />
            <span>{featuredTrack.artist}</span>
            <span>·</span>
            <span>{featuredTrack.album}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md"
        >
          <Artwork
            artwork={featuredTrack.artwork}
            title={featuredTrack.title}
            rounded="rounded-[2rem]"
            className="w-full shadow-2xl shadow-black/60"
          />
        </motion.div>
      </div>
    </section>
  );
}
