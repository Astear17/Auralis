"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Video } from "lucide-react";
import type { PlaybackAdapter } from "@/lib/adapters/types";
import { LocalAudioAdapter } from "@/lib/adapters/local-audio-adapter";
import { MockAdapter } from "@/lib/adapters/mock-adapter";
import { YouTubeEmbedAdapter } from "@/lib/adapters/youtube-embed-adapter";
import { usePlayerStore } from "@/lib/player/store";

export function PlaybackRuntime() {
  const pathname = usePathname();
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const seekNonce = usePlayerStore((state) => state.seekNonce);
  const youtubeSurface = useRef<HTMLDivElement>(null);
  const adapter = useRef<PlaybackAdapter | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPortalTarget(
        pathname === "/player"
          ? document.getElementById("youtube-player-slot")
          : null,
      );
    }, 750);
    return () => window.clearTimeout(timer);
  }, [pathname, currentTrack?.source]);

  useEffect(() => {
    adapter.current?.destroy();
    adapter.current = null;
    if (!currentTrack) return;

    if (currentTrack.source === "youtube") {
      if (!youtubeSurface.current) return;
      adapter.current = new YouTubeEmbedAdapter(youtubeSurface.current);
    } else if (currentTrack.source === "local") {
      adapter.current = new LocalAudioAdapter();
    } else {
      adapter.current = new MockAdapter();
    }

    const activeAdapter = adapter.current;
    activeAdapter
      .load(currentTrack, {
        onTime: (time, duration) =>
          usePlayerStore
            .getState()
            .setTime(time, duration || currentTrack.duration),
        onEnded: () => usePlayerStore.getState().nextTrack(),
        onPlayingChange: (playing) =>
          usePlayerStore.getState().setPlaying(playing),
        onError: (message) =>
          usePlayerStore.getState().setPlaybackError(message),
      })
      .then(() => {
        activeAdapter.setVolume(usePlayerStore.getState().volume);
        if (usePlayerStore.getState().isPlaying) return activeAdapter.play();
      })
      .catch((error: unknown) =>
        usePlayerStore
          .getState()
          .setPlaybackError(
            error instanceof Error
              ? error.message
              : "Playback could not start.",
          ),
      );

    fetch("/api/history", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ trackId: currentTrack.id }),
    }).catch(() => undefined);

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
      });
    }

    return () => {
      activeAdapter.destroy();
      if (adapter.current === activeAdapter) adapter.current = null;
    };
  }, [currentTrack, portalTarget]);

  useEffect(() => {
    if (!adapter.current) return;
    if (isPlaying)
      adapter.current
        .play()
        .catch(() => usePlayerStore.getState().setPlaying(false));
    else adapter.current.pause();
  }, [isPlaying]);

  useEffect(() => adapter.current?.setVolume(volume), [volume]);

  useEffect(() => {
    const state = usePlayerStore.getState();
    adapter.current?.seek(state.seekTarget);
  }, [seekNonce]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", () =>
      usePlayerStore.getState().setPlaying(true),
    );
    navigator.mediaSession.setActionHandler("pause", () =>
      usePlayerStore.getState().setPlaying(false),
    );
    navigator.mediaSession.setActionHandler("nexttrack", () =>
      usePlayerStore.getState().nextTrack(),
    );
    navigator.mediaSession.setActionHandler("previoustrack", () =>
      usePlayerStore.getState().previousTrack(),
    );
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime != null)
        usePlayerStore.getState().seek(details.seekTime);
    });
  }, []);

  if (currentTrack?.source !== "youtube") return null;

  const surface = (
    <aside
      className={
        portalTarget
          ? "w-full overflow-hidden rounded-2xl border border-white/15 bg-black/95 shadow-2xl shadow-black/30"
          : "fixed right-3 bottom-32 z-[70] w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-white/15 bg-black/95 shadow-2xl shadow-black/60 md:right-5 md:bottom-28"
      }
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-white/70">
        <Video className="size-4 text-red-400" />
        Official YouTube player · visible embed
      </div>
      <div className="aspect-video w-full bg-black">
        <div ref={youtubeSurface} className="h-full w-full" />
      </div>
    </aside>
  );

  return portalTarget ? createPortal(surface, portalTarget) : surface;
}
