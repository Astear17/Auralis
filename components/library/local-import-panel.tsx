"use client";

import { useEffect, useState } from "react";
import {
  FileAudio,
  ImagePlus,
  Music2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { TrackRow } from "@/components/cards/track-row";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
  deleteLocalTrack,
  listLocalTracks,
  saveLocalTrack,
  type LocalTrackRecord,
} from "@/lib/local-storage";
import type { Track } from "@/lib/types";
import { safeText } from "@/lib/utils";

function readDuration(file: File) {
  return new Promise<number>((resolve) => {
    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener("loadedmetadata", () => {
      const duration = Number.isFinite(audio.duration)
        ? Math.round(audio.duration)
        : 180;
      URL.revokeObjectURL(audio.src);
      resolve(duration);
    });
    audio.addEventListener("error", () => resolve(180));
  });
}

export function LocalImportPanel() {
  const [records, setRecords] = useState<LocalTrackRecord[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [lrcFile, setLrcFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () =>
    listLocalTracks()
      .then(setRecords)
      .catch(() => setRecords([]));
  useEffect(() => void refresh(), []);

  const importTrack = async () => {
    if (!audioFile) return;
    setBusy(true);
    const id = `local-${crypto.randomUUID()}`;
    const duration = await readDuration(audioFile);
    const track: Track = {
      id,
      title: safeText(title || audioFile.name.replace(/\.[^.]+$/, ""), 100),
      artist: safeText(artist || "Local artist", 100),
      artistId: "local-artist",
      album: safeText(album || "Local files", 100),
      albumId: "local-album",
      duration,
      source: "local",
      localBlobId: id,
      lyricsId: id,
      genres: ["Local"],
      year: new Date().getFullYear(),
      artwork: { primary: "#164e63", secondary: "#312e81", accent: "#67e8f9" },
    };
    await saveLocalTrack({
      id,
      track,
      audioBlob: audioFile,
      coverBlob: coverFile ?? undefined,
      lrcText: lrcFile ? await lrcFile.text() : undefined,
      createdAt: new Date().toISOString(),
    });
    setAudioFile(null);
    setCoverFile(null);
    setLrcFile(null);
    setTitle("");
    setArtist("");
    setAlbum("");
    setBusy(false);
    await refresh();
  };

  return (
    <div className="space-y-5">
      <GlassPanel className="p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-cyan-400/12 text-cyan-200">
            <Upload className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold">Add user-owned audio</h3>
            <p className="mt-1 text-xs leading-5 text-white/40">
              Files stay in this browser&apos;s IndexedDB. Add editable
              metadata, optional cover art, and synced LRC lyrics.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            {
              value: title,
              setter: setTitle,
              label: "Title",
              placeholder:
                audioFile?.name.replace(/\.[^.]+$/, "") || "Track title",
            },
            {
              value: artist,
              setter: setArtist,
              label: "Artist",
              placeholder: "Artist name",
            },
            {
              value: album,
              setter: setAlbum,
              label: "Album",
              placeholder: "Album title",
            },
          ].map((field) => (
            <label key={field.label} className="text-xs text-white/45">
              {field.label}
              <input
                value={field.value}
                onChange={(event) => field.setter(event.target.value)}
                placeholder={field.placeholder}
                className="mt-2 w-full rounded-xl border border-white/8 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/20"
              />
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black hover:bg-white/90">
            <FileAudio className="size-4" />{" "}
            {audioFile ? audioFile.name : "Choose audio"}
            <input
              type="file"
              accept="audio/*"
              onChange={(event) =>
                setAudioFile(event.target.files?.[0] ?? null)
              }
              className="sr-only"
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-xs font-semibold text-white/65 hover:bg-white/10 hover:text-white">
            <ImagePlus className="size-4" />{" "}
            {coverFile ? "Cover selected" : "Optional cover"}
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setCoverFile(event.target.files?.[0] ?? null)
              }
              className="sr-only"
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-xs font-semibold text-white/65 hover:bg-white/10 hover:text-white">
            <Music2 className="size-4" />{" "}
            {lrcFile ? "Lyrics selected" : "Optional LRC"}
            <input
              type="file"
              accept=".lrc,text/plain"
              onChange={(event) => setLrcFile(event.target.files?.[0] ?? null)}
              className="sr-only"
            />
          </label>
          <button
            disabled={!audioFile || busy}
            onClick={importTrack}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Plus className="size-4" /> {busy ? "Importing…" : "Add to library"}
          </button>
        </div>
      </GlassPanel>
      <div className="space-y-1">
        {records.length ? (
          records.map((record, index) => (
            <div key={record.id} className="flex items-center gap-1">
              <div className="min-w-0 flex-1">
                <TrackRow
                  track={record.track}
                  queue={records.map((item) => item.track)}
                  index={index}
                />
              </div>
              <button
                aria-label={`Delete ${record.track.title}`}
                onClick={() => deleteLocalTrack(record.id).then(refresh)}
                className="rounded-xl p-2 text-white/25 hover:bg-red-400/10 hover:text-red-300"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/30">
            Your local tracks will appear here after import.
          </p>
        )}
      </div>
    </div>
  );
}
