import {
  AlbumCard,
  MusicCard,
  PlaylistCard,
} from "@/components/cards/music-cards";
import { TrackRow } from "@/components/cards/track-row";
import { HeroSection } from "@/components/home/hero-section";
import {
  mockAlbums,
  mockPlaylists,
  mockTracks,
  recentTracks,
} from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="space-y-10 md:space-y-14">
      <HeroSection />
      <Section
        title="Made for this moment"
        subtitle="Fresh picks shaped by your listening"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {mockTracks.slice(0, 6).map((track) => (
            <MusicCard key={track.id} track={track} queue={mockTracks} />
          ))}
        </div>
      </Section>
      <Section
        title="Recently played"
        subtitle="Pick up where the sound left off"
      >
        <div className="space-y-1">
          {recentTracks.slice(0, 6).map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              queue={recentTracks}
              index={index}
            />
          ))}
        </div>
      </Section>
      <Section
        title="Essential mixes"
        subtitle="Built around a mood, never an ad"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </Section>
      <Section title="New worlds" subtitle="Albums worth your full attention">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {mockAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-xs text-white/35 md:text-sm">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
