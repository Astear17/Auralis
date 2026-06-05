"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Artwork } from "@/components/ui/artwork";
import { LyricsPanel } from "@/components/lyrics/lyrics-panel";
import { getLocalTrack } from "@/lib/local-storage";
import { parseLrc } from "@/lib/lyrics/lrc";
import type { LyricDocument, Track } from "@/lib/types";
import { usePlayerStore } from "@/lib/player/store";

export function LyricsRoute({
  trackId,
  initialTrack,
  initialLyric,
}: {
  trackId: string;
  initialTrack?: Track;
  initialLyric?: LyricDocument;
}) {
  const [track, setTrack] = useState(initialTrack);
  const [lyric, setLyric] = useState(initialLyric);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  useEffect(() => {
    if (initialTrack || !trackId.startsWith("local-")) return;
    getLocalTrack(trackId).then((record) => {
      if (!record) return;
      setTrack(record.track);
      if (record.lrcText)
        setLyric({
          trackId,
          lrc: record.lrcText,
          plainText: record.lrcText.replace(/\[[^\]]+\]/g, ""),
          offset: 0,
          lines: parseLrc(record.lrcText),
        });
    });
  }, [initialTrack, trackId]);
  const activeTrack =
    track ?? (currentTrack?.id === trackId ? currentTrack : undefined);
  if (!activeTrack)
    return (
      <p className="py-20 text-center text-white/40">
        This track is not available in the current library.
      </p>
    );
  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="xl:sticky xl:top-24 xl:h-fit">
        <Link
          href="/player"
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white"
        >
          <ArrowLeft className="size-4" /> Back to player
        </Link>
        <Artwork
          artwork={activeTrack.artwork}
          title={activeTrack.title}
          rounded="rounded-[2rem]"
          className="w-full"
        />
        <h1 className="mt-5 text-3xl font-bold tracking-tight">
          {activeTrack.title}
        </h1>
        <p className="mt-2 text-sm text-white/45">
          {activeTrack.artist} · {activeTrack.album}
        </p>
        <p className="mt-5 text-xs leading-5 text-white/30">
          Select any lyric line to seek. Use the edit control to stamp lines
          against the live playhead and fine-tune the global offset.
        </p>
      </aside>
      <LyricsPanel lyric={lyric} />
    </div>
  );
}
