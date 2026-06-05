"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GripVertical, ListMusic, Trash2, X } from "lucide-react";
import { Artwork } from "@/components/ui/artwork";
import { usePlayerStore } from "@/lib/player/store";
import { cn, formatTime } from "@/lib/utils";

export function QueuePanel() {
  const open = usePlayerStore((state) => state.queueOpen);
  const setOpen = usePlayerStore((state) => state.setQueueOpen);
  const queue = usePlayerStore((state) => state.queue);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const remove = usePlayerStore((state) => state.removeFromQueue);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close queue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[75] bg-black/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="glass fixed top-3 right-3 bottom-3 z-[80] flex w-[min(420px,calc(100vw-1.5rem))] flex-col rounded-3xl shadow-2xl shadow-black/60"
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
              <ListMusic className="size-5 text-violet-300" />
              <div>
                <h2 className="font-semibold">Playing next</h2>
                <p className="text-xs text-white/35">
                  {queue.length} tracks in queue
                </p>
              </div>
              <button
                aria-label="Close queue"
                onClick={() => setOpen(false)}
                className="ml-auto rounded-full p-2 text-white/40 hover:bg-white/8 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto p-2">
              {queue.map((track) => (
                <div
                  key={track.id}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl p-2 hover:bg-white/6",
                    currentTrack?.id === track.id && "bg-white/8",
                  )}
                >
                  <GripVertical className="size-4 shrink-0 text-white/15" />
                  <button
                    onClick={() => playTrack(track, queue)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <Artwork
                      artwork={track.artwork}
                      title={track.title}
                      rounded="rounded-lg"
                      className="size-11 shrink-0"
                    />
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-sm font-medium",
                          currentTrack?.id === track.id && "text-violet-300",
                        )}
                      >
                        {track.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-white/35">
                        {track.artist}
                      </span>
                    </span>
                  </button>
                  <span className="text-[11px] text-white/25 tabular-nums">
                    {formatTime(track.duration)}
                  </span>
                  <button
                    aria-label={`Remove ${track.title} from queue`}
                    onClick={() => remove(track.id)}
                    className="rounded-lg p-2 text-white/15 opacity-0 group-hover:opacity-100 hover:bg-white/8 hover:text-white focus:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
