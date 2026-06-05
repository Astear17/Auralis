"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link2, Play, Search, Video } from "lucide-react";
import {
  AlbumCard,
  ArtistCard,
  PlaylistCard,
} from "@/components/cards/music-cards";
import { TrackRow } from "@/components/cards/track-row";
import { GlassPanel } from "@/components/ui/glass-panel";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import type { SearchResults, Track } from "@/lib/types";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { usePlayerStore } from "@/lib/player/store";
import { cn } from "@/lib/utils";

type Filter = "all" | "songs" | "albums" | "artists" | "playlists";

export function SearchExperience() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const playTrack = usePlayerStore((state) => state.playTrack);
  const videoId = useMemo(() => extractYouTubeVideoId(query), [query]);
  const { data, isLoading } = useQuery<SearchResults>({
    queryKey: ["search", query],
    queryFn: () =>
      fetch(`/api/search?q=${encodeURIComponent(query)}`).then((response) =>
        response.json(),
      ),
  });

  const playYouTube = () => {
    if (!videoId) return;
    const track: Track = {
      id: `youtube-${videoId}`,
      title: "YouTube video",
      artist: "Official YouTube embed",
      artistId: "youtube",
      album: "YouTube embeds",
      albumId: "youtube",
      duration: 0,
      source: "youtube",
      youtubeVideoId: videoId,
      artwork: { primary: "#450a0a", secondary: "#18181b", accent: "#f87171" },
      genres: ["YouTube"],
      year: new Date().getFullYear(),
    };
    playTrack(track, [track]);
  };

  const filters: Filter[] = ["all", "songs", "albums", "artists", "playlists"];
  const hasQuery = query.trim().length > 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-violet-300 uppercase">
          Find your next favorite
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          Search & discover
        </h1>
      </div>
      <div className="relative">
        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-white/25" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search music or paste a YouTube URL / video ID"
          className="glass h-14 w-full rounded-2xl pr-4 pl-12 text-sm placeholder:text-white/25 md:h-16 md:text-base"
        />
      </div>
      {videoId && (
        <GlassPanel className="flex flex-col gap-4 border-red-300/10 p-5 sm:flex-row sm:items-center">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-red-400/12 text-red-300">
            <Video className="size-6" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold">Valid YouTube video detected</h2>
            <p className="mt-1 text-xs leading-5 text-white/40">
              It will play through the official, visible YouTube player. Ads and
              YouTube restrictions remain unchanged.
            </p>
          </div>
          <button
            onClick={playYouTube}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black"
          >
            <Play className="size-4 fill-current" /> Open embed
          </button>
        </GlassPanel>
      )}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-medium text-white/45 capitalize hover:bg-white/10 hover:text-white",
              filter === item &&
                "bg-white text-black hover:bg-white hover:text-black",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <LoadingSkeleton key={index} className="aspect-square" />
          ))}
        </div>
      ) : (
        <>
          {(filter === "all" || filter === "songs") && (
            <section>
              <h2 className="mb-3 text-xl font-bold">
                {hasQuery ? "Songs" : "Popular right now"}
              </h2>
              <div className="space-y-1">
                {data?.tracks
                  .slice(0, filter === "songs" ? 20 : 6)
                  .map((track, index) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      queue={data.tracks}
                      index={index}
                    />
                  ))}
              </div>
            </section>
          )}
          {(filter === "all" || filter === "albums") && (
            <ResultGrid title="Albums">
              {data?.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </ResultGrid>
          )}
          {(filter === "all" || filter === "artists") && (
            <ResultGrid title="Artists">
              {data?.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </ResultGrid>
          )}
          {(filter === "all" || filter === "playlists") && (
            <ResultGrid title="Playlists">
              {data?.playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </ResultGrid>
          )}
        </>
      )}
      <GlassPanel className="flex items-start gap-3 p-5 text-xs leading-5 text-white/40">
        <Link2 className="mt-0.5 size-4 shrink-0 text-cyan-300" />
        Optional YouTube metadata search only runs when the server has a
        `YOUTUBE_API_KEY`. Auralis never asks for or stores Google account
        credentials.
      </GlassPanel>
    </div>
  );
}

function ResultGrid({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {children}
      </div>
    </section>
  );
}
