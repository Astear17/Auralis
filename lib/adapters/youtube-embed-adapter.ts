import type { PlaybackAdapter, PlaybackCallbacks } from "@/lib/adapters/types";
import type { Track } from "@/lib/types";

type PlayerStateEvent = { data: number };
type PlayerErrorEvent = { data: number };
type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (time: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars: Record<string, number | string>;
          events: {
            onReady: () => void;
            onStateChange: (event: PlayerStateEvent) => void;
            onError: (event: PlayerErrorEvent) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

async function loadYouTubeApi() {
  if (window.YT?.Player) return;
  await new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });
}

export class YouTubeEmbedAdapter implements PlaybackAdapter {
  private player: YTPlayer | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private callbacks: PlaybackCallbacks | null = null;

  constructor(private container: HTMLElement) {}

  async load(track: Track, callbacks: PlaybackCallbacks) {
    this.destroy();
    if (!track.youtubeVideoId)
      throw new Error("A valid YouTube video ID is required.");
    this.callbacks = callbacks;
    await loadYouTubeApi();

    // This app does not bypass YouTube ads or Premium restrictions.
    await new Promise<void>((resolve, reject) => {
      if (!window.YT?.Player) {
        reject(new Error("The official YouTube player could not be loaded."));
        return;
      }
      this.player = new window.YT.Player(this.container, {
        videoId: track.youtubeVideoId!,
        playerVars: {
          controls: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            this.startTimer();
            resolve();
          },
          onStateChange: (event) => {
            const state = window.YT?.PlayerState;
            if (!state) return;
            if (event.data === state.ENDED) callbacks.onEnded();
            callbacks.onPlayingChange(event.data === state.PLAYING);
          },
          onError: (event) =>
            callbacks.onError(
              `The official YouTube player returned error ${event.data}.`,
            ),
        },
      });
    });
  }

  async play() {
    this.player?.playVideo();
  }

  pause() {
    this.player?.pauseVideo();
  }

  seek(time: number) {
    this.player?.seekTo(time, true);
  }

  setVolume(volume: number) {
    this.player?.setVolume(Math.round(Math.max(0, Math.min(1, volume)) * 100));
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.player?.destroy();
    this.player = null;
    this.callbacks = null;
  }

  private startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.player) return;
      this.callbacks?.onTime(
        this.player.getCurrentTime(),
        this.player.getDuration(),
      );
    }, 500);
  }
}
