import { notFound } from "next/navigation";
import Link from "next/link";
import { TrackRow } from "@/components/cards/track-row";
import { CollectionPlayButton } from "@/components/player/collection-play-button";
import { Artwork } from "@/components/ui/artwork";
import { getAlbum, tracksFromIds } from "@/lib/mock-data";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = getAlbum(id);
  if (!album) notFound();
  const tracks = tracksFromIds(album.trackIds);
  return (
    <div>
      <header className="mb-8 grid items-end gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
        <Artwork
          artwork={album.artwork}
          title={album.title}
          rounded="rounded-[2rem]"
          className="w-full max-w-64"
        />
        <div>
          <p className="text-xs font-semibold tracking-[.18em] text-cyan-300 uppercase">
            Album · {album.year}
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-[-.05em] md:text-7xl">
            {album.title}
          </h1>
          <Link
            href={`/artist/${album.artistId}`}
            className="mt-3 inline-block text-lg text-white/55 hover:text-white"
          >
            {album.artist}
          </Link>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
            {album.description}
          </p>
          <div className="mt-6">
            <CollectionPlayButton tracks={tracks} label="Play album" />
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
