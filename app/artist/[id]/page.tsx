import { notFound } from "next/navigation";
import { AlbumCard } from "@/components/cards/music-cards";
import { TrackRow } from "@/components/cards/track-row";
import { CollectionPlayButton } from "@/components/player/collection-play-button";
import { Artwork } from "@/components/ui/artwork";
import { getArtist, mockAlbums, mockTracks } from "@/lib/mock-data";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artist = getArtist(id);
  if (!artist) notFound();
  const tracks = mockTracks.filter((track) => track.artistId === id);
  const albums = mockAlbums.filter((album) => album.artistId === id);
  return (
    <div className="space-y-10">
      <header className="grid items-center gap-7 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:grid-cols-[240px_minmax(0,1fr)] md:p-8">
        <Artwork
          artwork={artist.artwork}
          title={artist.name}
          rounded="rounded-full"
          className="w-full max-w-60"
        />
        <div>
          <p className="text-xs font-semibold tracking-[.18em] text-pink-300 uppercase">
            Artist · {artist.monthlyListeners} monthly listeners
          </p>
          <h1 className="mt-3 text-6xl font-bold tracking-[-.055em] md:text-8xl">
            {artist.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
            {artist.bio}
          </p>
          <div className="mt-6">
            <CollectionPlayButton tracks={tracks} label="Play top songs" />
          </div>
        </div>
      </header>
      <section>
        <h2 className="mb-4 text-2xl font-bold">Top songs</h2>
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              queue={tracks}
              index={index}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-bold">Albums</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
}
