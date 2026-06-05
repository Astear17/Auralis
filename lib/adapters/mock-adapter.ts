import type { PlaybackAdapter, PlaybackCallbacks } from "@/lib/adapters/types";
import type { Track } from "@/lib/types";

export class MockAdapter implements PlaybackAdapter {
  private current = 0;
  private duration = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private callbacks: PlaybackCallbacks | null = null;

  async load(track: Track, callbacks: PlaybackCallbacks) {
    this.destroy();
    this.current = 0;
    this.duration = track.duration;
    this.callbacks = callbacks;
    callbacks.onTime(0, this.duration);
  }

  async play() {
    if (this.timer) return;
    this.callbacks?.onPlayingChange(true);
    this.timer = setInterval(() => {
      this.current = Math.min(this.current + 0.25, this.duration);
      this.callbacks?.onTime(this.current, this.duration);
      if (this.current >= this.duration) {
        this.pause();
        this.callbacks?.onEnded();
      }
    }, 250);
  }

  pause() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.callbacks?.onPlayingChange(false);
  }

  seek(time: number) {
    this.current = Math.max(0, Math.min(time, this.duration));
    this.callbacks?.onTime(this.current, this.duration);
  }

  setVolume() {}

  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.callbacks = null;
  }
}
