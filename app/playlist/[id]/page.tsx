import { notFound } from "next/navigation";
import { TrackRow } from "@/components/cards/track-row";
import { CollectionPlayButton } from "@/components/player/collection-play-button";
import { Artwork } from "@/components/ui/artwork";
import { getPlaylist, tracksFromIds } from "@/lib/mock-data";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playlist = getPlaylist(id);
  if (!playlist) notFound();
  const tracks = tracksFromIds(playlist.trackIds);
  return (
    <div>
      <header className="mb-8 grid items-end gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <Artwork
          artwork={playlist.artwork}
          title={playlist.title}
          rounded="rounded-[2rem]"
          className="w-full max-w-60"
        />
        <div>
          <p className="text-xs font-semibold tracking-[.18em] text-violet-300 uppercase">
            Playlist · {playlist.owner}
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-[-.05em] md:text-7xl">
            {playlist.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
            {playlist.description}
          </p>
          <div className="mt-6">
            <CollectionPlayButton tracks={tracks} label="Play playlist" />
          </div>
        </div>
      </header>
      <div className="space-y-1">
        {tracks.map((track, index) => (
          <TrackRow key={track.id} track={track} queue={tracks} index={index} />
        ))}
      </div>
    </div>
  );
}
