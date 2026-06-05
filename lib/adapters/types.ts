import type { Track } from "@/lib/types";

export type PlaybackCallbacks = {
  onTime: (time: number, duration: number) => void;
  onEnded: () => void;
  onPlayingChange: (playing: boolean) => void;
  onError: (message: string) => void;
};

export interface PlaybackAdapter {
  load(track: Track, callbacks: PlaybackCallbacks): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  destroy(): void;
}
