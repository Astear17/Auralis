"use client";

import { useState } from "react";
import {
  AlbumCard,
  ArtistCard,
  PlaylistCard,
} from "@/components/cards/music-cards";
import { TrackRow } from "@/components/cards/track-row";
import { LocalImportPanel } from "@/components/library/local-import-panel";
import { EmptyState } from "@/components/ui/empty-state";
import {
  mockAlbums,
  mockArtists,
  mockPlaylists,
  mockTracks,
} from "@/lib/mock-data";
import { usePlayerStore } from "@/lib/player/store";
import { cn } from "@/lib/utils";

type Tab = "Songs" | "Albums" | "Artists" | "Playlists" | "Local Files";
const tabs: Tab[] = ["Songs", "Albums", "Artists", "Playlists", "Local Files"];

export function LibraryExperience() {
  const [tab, setTab] = useState<Tab>("Songs");
  const favorites = usePlayerStore((state) => state.favorites);
  const favoriteTracks = mockTracks.filter((track) =>
    favorites.includes(track.id),
  );
  return (
    <div>
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={cn(
              "shrink-0 rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-medium text-white/45 hover:bg-white/10 hover:text-white",
              tab === item &&
                "bg-white text-black hover:bg-white hover:text-black",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Songs" &&
        (favoriteTracks.length ? (
          <div className="space-y-1">
            {favoriteTracks.map((track, index) => (
              <TrackRow
                key={track.id}
                track={track}
                queue={favoriteTracks}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your favorites are waiting"
            description="Tap the heart beside any track to build a personal collection here."
          />
        ))}
      {tab === "Albums" && (
        <Grid>
          {mockAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </Grid>
      )}
      {tab === "Artists" && (
        <Grid>
          {mockArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </Grid>
      )}
      {tab === "Playlists" && (
        <Grid>
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </Grid>
      )}
      {tab === "Local Files" && <LocalImportPanel />}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {children}
    </div>
  );
}
