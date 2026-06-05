"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { featuredTrack, mockTracks } from "@/lib/mock-data";
import type { Track } from "@/lib/types";

export type RepeatMode = "off" | "all" | "one";

type PlayerState = {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  queueOpen: boolean;
  lyricsOpen: boolean;
  seekTarget: number;
  seekNonce: number;
  favorites: string[];
  history: string[];
  playbackError: string | null;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlayback: () => void;
  setPlaying: (playing: boolean) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (time: number) => void;
  setTime: (time: number, duration: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleQueue: () => void;
  toggleLyrics: () => void;
  setQueueOpen: (open: boolean) => void;
  setLyricsOpen: (open: boolean) => void;
  setQueue: (queue: Track[]) => void;
  removeFromQueue: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setPlaybackError: (error: string | null) => void;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: featuredTrack,
      queue: mockTracks.slice(0, 10),
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.72,
      shuffle: false,
      repeat: "off",
      queueOpen: false,
      lyricsOpen: false,
      seekTarget: 0,
      seekNonce: 0,
      favorites: [],
      history: [],
      playbackError: null,
      playTrack: (track, queue) =>
        set((state) => ({
          currentTrack: track,
          queue: queue?.length
            ? queue
            : state.queue.length
              ? state.queue
              : [track],
          isPlaying: true,
          currentTime: 0,
          duration: track.duration,
          playbackError: null,
          history: [
            track.id,
            ...state.history.filter((id) => id !== track.id),
          ].slice(0, 50),
        })),
      togglePlayback: () =>
        set((state) => ({
          isPlaying: state.currentTrack ? !state.isPlaying : false,
        })),
      setPlaying: (playing) => set({ isPlaying: playing }),
      nextTrack: () => {
        const state = get();
        if (!state.currentTrack || !state.queue.length) return;
        if (state.repeat === "one") {
          state.seek(0);
          set({ isPlaying: true });
          return;
        }
        const currentIndex = state.queue.findIndex(
          (track) => track.id === state.currentTrack?.id,
        );
        const nextIndex = state.shuffle
          ? Math.floor(Math.random() * state.queue.length)
          : currentIndex + 1 < state.queue.length
            ? currentIndex + 1
            : state.repeat === "all"
              ? 0
              : -1;
        if (nextIndex < 0) {
          set({ isPlaying: false });
          return;
        }
        get().playTrack(state.queue[nextIndex], state.queue);
      },
      previousTrack: () => {
        const state = get();
        if (state.currentTime > 4) {
          state.seek(0);
          return;
        }
        const currentIndex = state.queue.findIndex(
          (track) => track.id === state.currentTrack?.id,
        );
        const previousIndex =
          currentIndex > 0
            ? currentIndex - 1
            : state.repeat === "all"
              ? state.queue.length - 1
              : 0;
        if (state.queue[previousIndex])
          get().playTrack(state.queue[previousIndex], state.queue);
      },
      seek: (time) =>
        set((state) => ({
          seekTarget: time,
          seekNonce: state.seekNonce + 1,
          currentTime: time,
        })),
      setTime: (time, duration) => set({ currentTime: time, duration }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      cycleRepeat: () =>
        set((state) => ({
          repeat:
            state.repeat === "off"
              ? "all"
              : state.repeat === "all"
                ? "one"
                : "off",
        })),
      toggleQueue: () => set((state) => ({ queueOpen: !state.queueOpen })),
      toggleLyrics: () => set((state) => ({ lyricsOpen: !state.lyricsOpen })),
      setQueueOpen: (queueOpen) => set({ queueOpen }),
      setLyricsOpen: (lyricsOpen) => set({ lyricsOpen }),
      setQueue: (queue) => set({ queue }),
      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((track) => track.id !== id),
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favorite) => favorite !== id)
            : [id, ...state.favorites],
        })),
      setPlaybackError: (playbackError) => set({ playbackError }),
    }),
    {
      name: "auralis-player",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        queue: state.queue,
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        favorites: state.favorites,
        history: state.history,
      }),
    },
  ),
);
