"use client";

import { useState } from "react";
import { Edit3, Sparkles, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LyricTimestampEditor } from "@/components/lyrics/lyric-timestamp-editor";
import { SyncedLyrics } from "@/components/lyrics/synced-lyrics";
import type { LyricDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LyricsPanel({ lyric }: { lyric?: LyricDocument }) {
  const [editing, setEditing] = useState(false);
  const [glow, setGlow] = useState(true);
  const [document, setDocument] = useState(lyric);

  if (!document?.lines.length) {
    return (
      <EmptyState
        title="No lyrics yet"
        description="Upload an LRC file with your local track or use the timestamp editor to create synced lyrics."
      />
    );
  }

  return (
    <div className="glass relative h-[calc(100vh-11rem)] min-h-[560px] overflow-hidden rounded-[2rem]">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-black/25 p-1 backdrop-blur-xl">
        <button
          aria-label="Toggle karaoke glow"
          onClick={() => setGlow((value) => !value)}
          className={cn(
            "rounded-full p-2 text-white/35 hover:bg-white/8 hover:text-white",
            glow && "text-violet-300",
          )}
        >
          <Sparkles className="size-4" />
        </button>
        <button
          aria-label={
            editing ? "Close timestamp editor" : "Edit lyric timestamps"
          }
          onClick={() => setEditing((value) => !value)}
          className={cn(
            "rounded-full p-2 text-white/35 hover:bg-white/8 hover:text-white",
            editing && "text-violet-300",
          )}
        >
          {editing ? <X className="size-4" /> : <Edit3 className="size-4" />}
        </button>
      </div>
      {editing ? (
        <LyricTimestampEditor lyric={document} onSaved={setDocument} />
      ) : (
        <SyncedLyrics
          lines={document.lines}
          offset={document.offset}
          karaokeGlow={glow}
        />
      )}
    </div>
  );
}
