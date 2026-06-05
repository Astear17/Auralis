"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Artwork } from "@/components/ui/artwork";
import type { Album, Artist, Playlist, Track } from "@/lib/types";
import { tracksFromIds } from "@/lib/mock-data";
import { usePlayerStore } from "@/lib/player/store";

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group min-w-0"
    >
      {children}
    </motion.article>
  );
}

export function MusicCard({ track, queue }: { track: Track; queue?: Track[] }) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  return (
    <CardShell>
      <div className="relative">
        <Artwork
          artwork={track.artwork}
          title={track.title}
          className="w-full transition duration-300 group-hover:saturate-125"
        />
        <button
          aria-label={`Play ${track.title}`}
          onClick={() => playTrack(track, queue)}
          className="absolute right-3 bottom-3 grid size-11 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
        >
          <Play className="ml-0.5 size-5 fill-current" />
        </button>
      </div>
      <button
        onClick={() => playTrack(track, queue)}
        className="mt-3 block w-full text-left"
      >
        <h3 className="truncate text-sm font-semibold">{track.title}</h3>
        <p className="mt-1 truncate text-xs text-white/45">{track.artist}</p>
      </button>
    </CardShell>
  );
}

export function AlbumCard({ album }: { album: Album }) {
  return (
    <CardShell>
      <Link href={`/album/${album.id}`}>
        <Artwork
          artwork={album.artwork}
          title={album.title}
          className="w-full transition duration-300 group-hover:saturate-125"
        />
        <h3 className="mt-3 truncate text-sm font-semibold">{album.title}</h3>
        <p className="mt-1 truncate text-xs text-white/45">
          {album.artist} · {album.year}
        </p>
      </Link>
    </CardShell>
  );
}

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <CardShell>
      <Link href={`/artist/${artist.id}`} className="block text-center">
        <Artwork
          artwork={artist.artwork}
          title={artist.name}
          rounded="rounded-full"
          className="w-full transition duration-300 group-hover:saturate-125"
        />
        <h3 className="mt-3 truncate text-sm font-semibold">{artist.name}</h3>
        <p className="mt-1 truncate text-xs text-white/45">
          {artist.genres[0]}
        </p>
      </Link>
    </CardShell>
  );
}

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const tracks = tracksFromIds(playlist.trackIds);
  return (
    <CardShell>
      <div className="relative">
        <Link href={`/playlist/${playlist.id}`}>
          <Artwork
            artwork={playlist.artwork}
            title={playlist.title}
            className="w-full transition duration-300 group-hover:saturate-125"
          />
        </Link>
        <button
          aria-label={`Play ${playlist.title}`}
          onClick={() => tracks[0] && playTrack(tracks[0], tracks)}
          className="absolute right-3 bottom-3 grid size-11 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
        >
          <Play className="ml-0.5 size-5 fill-current" />
        </button>
      </div>
      <Link href={`/playlist/${playlist.id}`}>
        <h3 className="mt-3 truncate text-sm font-semibold">
          {playlist.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-white/45">
          {playlist.description}
        </p>
      </Link>
    </CardShell>
  );
}
