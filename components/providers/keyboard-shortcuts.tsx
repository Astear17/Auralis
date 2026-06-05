"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/lib/player/store";

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null;
      if (element?.matches("input, textarea, select, [contenteditable='true']"))
        return;
      const state = usePlayerStore.getState();
      if (event.code === "Space") {
        event.preventDefault();
        state.togglePlayback();
      } else if (event.key === "ArrowRight")
        state.seek(Math.min(state.duration, state.currentTime + 10));
      else if (event.key === "ArrowLeft")
        state.seek(Math.max(0, state.currentTime - 10));
      else if (event.key.toLowerCase() === "n") state.nextTrack();
      else if (event.key.toLowerCase() === "p") state.previousTrack();
      else if (event.key.toLowerCase() === "l") {
        state.toggleLyrics();
        if (!state.lyricsOpen && state.currentTrack)
          router.push(`/lyrics/${state.currentTrack.id}`);
      } else if (event.key.toLowerCase() === "q") state.toggleQueue();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
