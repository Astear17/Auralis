"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, Minus, Plus, Save } from "lucide-react";
import type { LyricDocument, LyricLine } from "@/lib/types";
import { serializeLrc } from "@/lib/lyrics/lrc";
import { usePlayerStore } from "@/lib/player/store";
import { formatTime } from "@/lib/utils";

export function LyricTimestampEditor({
  lyric,
  onSaved,
}: {
  lyric: LyricDocument;
  onSaved?: (lyric: LyricDocument) => void;
}) {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const [lines, setLines] = useState<LyricLine[]>(lyric.lines);
  const [offset, setOffset] = useState(lyric.offset);
  const [saved, setSaved] = useState(false);
  const serialized = useMemo(() => serializeLrc(lines), [lines]);

  const updateTime = (id: string, time: number) => {
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, time: Math.max(0, time) } : line,
      ),
    );
    setSaved(false);
  };

  const save = async () => {
    const next = { ...lyric, lrc: serialized, offset, lines };
    await fetch(`/api/lyrics/${lyric.trackId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        lrc: serialized,
        plainText: lyric.plainText,
        offset,
      }),
    });
    setSaved(true);
    onSaved?.(next);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/8 px-3 py-3">
        <span className="text-xs font-semibold text-white/55">
          Global offset
        </span>
        <button
          aria-label="Decrease lyric offset"
          onClick={() => setOffset((value) => value - 100)}
          className="rounded-lg bg-white/7 p-2 hover:bg-white/12"
        >
          <Minus className="size-3" />
        </button>
        <span className="min-w-16 text-center text-xs text-white/45 tabular-nums">
          {offset > 0 ? "+" : ""}
          {offset} ms
        </span>
        <button
          aria-label="Increase lyric offset"
          onClick={() => setOffset((value) => value + 100)}
          className="rounded-lg bg-white/7 p-2 hover:bg-white/12"
        >
          <Plus className="size-3" />
        </button>
        <button
          onClick={save}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90"
        >
          {saved ? (
            <Check className="size-3.5" />
          ) : (
            <Save className="size-3.5" />
          )}
          {saved ? "Saved" : "Save LRC"}
        </button>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto p-2">
        {lines.map((line) => (
          <div
            key={line.id}
            className="group flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/6"
          >
            <button
              onClick={() => updateTime(line.id, currentTime)}
              title="Stamp with current playback time"
              className="inline-flex min-w-20 items-center gap-1.5 rounded-lg bg-white/7 px-2 py-1.5 text-[11px] text-violet-200 tabular-nums hover:bg-white/12"
            >
              <Clock3 className="size-3" />
              {formatTime(line.time)}
            </button>
            <input
              aria-label={`Timestamp for ${line.text}`}
              type="number"
              min={0}
              step={0.1}
              value={line.time}
              onChange={(event) =>
                updateTime(line.id, Number(event.target.value))
              }
              className="w-20 rounded-lg border border-white/8 bg-black/20 px-2 py-1.5 text-xs text-white/55"
            />
            <span className="min-w-0 flex-1 truncate text-sm text-white/55">
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
