import type { PlaybackAdapter, PlaybackCallbacks } from "@/lib/adapters/types";
import { getLocalTrack } from "@/lib/local-storage";
import type { Track } from "@/lib/types";

export class LocalAudioAdapter implements PlaybackAdapter {
  private audio: HTMLAudioElement | null = null;
  private objectUrl: string | null = null;
  private callbacks: PlaybackCallbacks | null = null;

  async load(track: Track, callbacks: PlaybackCallbacks) {
    this.destroy();
    if (!track.localBlobId)
      throw new Error("This local track has no stored audio file.");
    const record = await getLocalTrack(track.localBlobId);
    if (!record)
      throw new Error(
        "The local audio file is no longer available in this browser.",
      );

    this.callbacks = callbacks;
    this.objectUrl = URL.createObjectURL(record.audioBlob);
    this.audio = new Audio(this.objectUrl);
    this.audio.preload = "metadata";
    this.audio.addEventListener("timeupdate", this.handleTime);
    this.audio.addEventListener("durationchange", this.handleTime);
    this.audio.addEventListener("ended", this.handleEnded);
    this.audio.addEventListener("play", this.handlePlay);
    this.audio.addEventListener("pause", this.handlePause);
    this.audio.addEventListener("error", this.handleError);
    this.audio.load();
  }

  async play() {
    await this.audio?.play();
  }

  pause() {
    this.audio?.pause();
  }

  seek(time: number) {
    if (this.audio) this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    if (this.audio) this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  destroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener("timeupdate", this.handleTime);
      this.audio.removeEventListener("durationchange", this.handleTime);
      this.audio.removeEventListener("ended", this.handleEnded);
      this.audio.removeEventListener("play", this.handlePlay);
      this.audio.removeEventListener("pause", this.handlePause);
      this.audio.removeEventListener("error", this.handleError);
      this.audio.src = "";
    }
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.audio = null;
    this.objectUrl = null;
    this.callbacks = null;
  }

  private handleTime = () => {
    if (!this.audio) return;
    this.callbacks?.onTime(
      this.audio.currentTime,
      Number.isFinite(this.audio.duration) ? this.audio.duration : 0,
    );
  };

  private handleEnded = () => this.callbacks?.onEnded();
  private handlePlay = () => this.callbacks?.onPlayingChange(true);
  private handlePause = () => this.callbacks?.onPlayingChange(false);
  private handleError = () =>
    this.callbacks?.onError(
      "The browser could not play this local audio file.",
    );
}
