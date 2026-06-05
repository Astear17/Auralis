import type {
  Album,
  Artist,
  LyricDocument,
  Playlist,
  Track,
} from "@/lib/types";
import { parseLrc } from "@/lib/lyrics/lrc";

const art = (primary: string, secondary: string, accent: string) => ({
  primary,
  secondary,
  accent,
});

export const mockArtists: Artist[] = [
  {
    id: "artist-nova",
    name: "Nova Vale",
    artwork: art("#17213b", "#7c3aed", "#f472b6"),
    genres: ["Dream pop", "Electronic"],
    monthlyListeners: "2.4M",
    bio: "Luminous synths, intimate vocals, and the feeling of driving through a sleeping city.",
  },
  {
    id: "artist-solace",
    name: "Solace Systems",
    artwork: art("#071b2c", "#0f766e", "#5eead4"),
    genres: ["Ambient", "Downtempo"],
    monthlyListeners: "841K",
    bio: "Patient electronic compositions designed for deep focus and late-night clarity.",
  },
  {
    id: "artist-mara",
    name: "Mara June",
    artwork: art("#451a03", "#be123c", "#fbbf24"),
    genres: ["Indie soul", "Alternative"],
    monthlyListeners: "1.7M",
    bio: "Warm analog soul with restless percussion and plainspoken stories.",
  },
  {
    id: "artist-circuit",
    name: "The Circuit Bloom",
    artwork: art("#111827", "#1d4ed8", "#67e8f9"),
    genres: ["Synthwave", "Electronic"],
    monthlyListeners: "963K",
    bio: "Wide-screen electronic music made for neon horizons.",
  },
  {
    id: "artist-aoki",
    name: "Eli Aoki",
    artwork: art("#1c1917", "#7c2d12", "#fdba74"),
    genres: ["Jazz", "Lo-fi"],
    monthlyListeners: "512K",
    bio: "A pianist and tape-loop artist finding small worlds between the notes.",
  },
  {
    id: "artist-tide",
    name: "Tidal Memory",
    artwork: art("#082f49", "#0369a1", "#bae6fd"),
    genres: ["Post-rock", "Ambient"],
    monthlyListeners: "708K",
    bio: "Instrumental tides that rise slowly and break in color.",
  },
];

export const mockAlbums: Album[] = [
  {
    id: "album-afterlight",
    title: "Afterlight",
    artist: "Nova Vale",
    artistId: "artist-nova",
    artwork: art("#291145", "#7c3aed", "#fb7185"),
    year: 2026,
    genres: ["Dream pop", "Electronic"],
    trackIds: ["track-afterlight", "track-orbit", "track-slow-motion"],
    description:
      "A soft-focus record about the glow that lingers after everything changes.",
  },
  {
    id: "album-soft-machines",
    title: "Soft Machines",
    artist: "Solace Systems",
    artistId: "artist-solace",
    artwork: art("#042f2e", "#155e75", "#5eead4"),
    year: 2025,
    genres: ["Ambient", "Downtempo"],
    trackIds: ["track-soft-machines", "track-still-signal", "track-rain-cache"],
    description: "Slow systems, warm circuits, and space enough to think.",
  },
  {
    id: "album-golden-hour",
    title: "Borrowed Golden Hour",
    artist: "Mara June",
    artistId: "artist-mara",
    artwork: art("#431407", "#9f1239", "#fbbf24"),
    year: 2026,
    genres: ["Indie soul", "Alternative"],
    trackIds: ["track-golden-hour", "track-open-window", "track-paper-sun"],
    description: "Songs for the last bright minutes of a long day.",
  },
  {
    id: "album-night-transit",
    title: "Night Transit",
    artist: "The Circuit Bloom",
    artistId: "artist-circuit",
    artwork: art("#0f172a", "#1e40af", "#22d3ee"),
    year: 2024,
    genres: ["Synthwave", "Electronic"],
    trackIds: ["track-night-transit", "track-blue-exit", "track-magnetic"],
    description: "A midnight route through electric weather.",
  },
  {
    id: "album-small-hours",
    title: "The Small Hours",
    artist: "Eli Aoki",
    artistId: "artist-aoki",
    artwork: art("#292524", "#7c2d12", "#fed7aa"),
    year: 2025,
    genres: ["Jazz", "Lo-fi"],
    trackIds: ["track-small-hours", "track-window-seat", "track-first-coffee"],
    description: "Quiet piano sketches recorded while the city slept.",
  },
  {
    id: "album-sea-glass",
    title: "Sea Glass Cities",
    artist: "Tidal Memory",
    artistId: "artist-tide",
    artwork: art("#082f49", "#0e7490", "#a5f3fc"),
    year: 2026,
    genres: ["Post-rock", "Ambient"],
    trackIds: ["track-sea-glass", "track-low-tide", "track-horizon-line"],
    description: "Instrumental songs shaped by water, distance, and return.",
  },
];

const makeTrack = (
  id: string,
  title: string,
  artist: string,
  artistId: string,
  album: string,
  albumId: string,
  duration: number,
  genres: string[],
  year: number,
): Track => ({
  id,
  title,
  artist,
  artistId,
  album,
  albumId,
  duration,
  source: "mock",
  artwork:
    mockAlbums.find((item) => item.id === albumId)?.artwork ??
    art("#171717", "#333", "#777"),
  genres,
  year,
  lyricsId: id,
});

export const mockTracks: Track[] = [
  makeTrack(
    "track-afterlight",
    "Afterlight",
    "Nova Vale",
    "artist-nova",
    "Afterlight",
    "album-afterlight",
    238,
    ["Dream pop", "Electronic"],
    2026,
  ),
  makeTrack(
    "track-orbit",
    "Stay in Orbit",
    "Nova Vale",
    "artist-nova",
    "Afterlight",
    "album-afterlight",
    214,
    ["Dream pop"],
    2026,
  ),
  makeTrack(
    "track-slow-motion",
    "Slow Motion Weather",
    "Nova Vale",
    "artist-nova",
    "Afterlight",
    "album-afterlight",
    251,
    ["Electronic"],
    2026,
  ),
  makeTrack(
    "track-soft-machines",
    "Soft Machines",
    "Solace Systems",
    "artist-solace",
    "Soft Machines",
    "album-soft-machines",
    326,
    ["Ambient", "Downtempo"],
    2025,
  ),
  makeTrack(
    "track-still-signal",
    "Still Signal",
    "Solace Systems",
    "artist-solace",
    "Soft Machines",
    "album-soft-machines",
    289,
    ["Ambient"],
    2025,
  ),
  makeTrack(
    "track-rain-cache",
    "Rain Cache",
    "Solace Systems",
    "artist-solace",
    "Soft Machines",
    "album-soft-machines",
    305,
    ["Downtempo"],
    2025,
  ),
  makeTrack(
    "track-golden-hour",
    "Borrowed Golden Hour",
    "Mara June",
    "artist-mara",
    "Borrowed Golden Hour",
    "album-golden-hour",
    223,
    ["Indie soul"],
    2026,
  ),
  makeTrack(
    "track-open-window",
    "Open Window",
    "Mara June",
    "artist-mara",
    "Borrowed Golden Hour",
    "album-golden-hour",
    196,
    ["Alternative"],
    2026,
  ),
  makeTrack(
    "track-paper-sun",
    "Paper Sun",
    "Mara June",
    "artist-mara",
    "Borrowed Golden Hour",
    "album-golden-hour",
    242,
    ["Indie soul"],
    2026,
  ),
  makeTrack(
    "track-night-transit",
    "Night Transit",
    "The Circuit Bloom",
    "artist-circuit",
    "Night Transit",
    "album-night-transit",
    268,
    ["Synthwave"],
    2024,
  ),
  makeTrack(
    "track-blue-exit",
    "Blue Exit",
    "The Circuit Bloom",
    "artist-circuit",
    "Night Transit",
    "album-night-transit",
    247,
    ["Electronic"],
    2024,
  ),
  makeTrack(
    "track-magnetic",
    "Magnetic Avenue",
    "The Circuit Bloom",
    "artist-circuit",
    "Night Transit",
    "album-night-transit",
    231,
    ["Synthwave"],
    2024,
  ),
  makeTrack(
    "track-small-hours",
    "The Small Hours",
    "Eli Aoki",
    "artist-aoki",
    "The Small Hours",
    "album-small-hours",
    201,
    ["Jazz", "Lo-fi"],
    2025,
  ),
  makeTrack(
    "track-window-seat",
    "Window Seat",
    "Eli Aoki",
    "artist-aoki",
    "The Small Hours",
    "album-small-hours",
    187,
    ["Lo-fi"],
    2025,
  ),
  makeTrack(
    "track-first-coffee",
    "First Coffee",
    "Eli Aoki",
    "artist-aoki",
    "The Small Hours",
    "album-small-hours",
    174,
    ["Jazz"],
    2025,
  ),
  makeTrack(
    "track-sea-glass",
    "Sea Glass Cities",
    "Tidal Memory",
    "artist-tide",
    "Sea Glass Cities",
    "album-sea-glass",
    342,
    ["Post-rock", "Ambient"],
    2026,
  ),
  makeTrack(
    "track-low-tide",
    "Low Tide Radio",
    "Tidal Memory",
    "artist-tide",
    "Sea Glass Cities",
    "album-sea-glass",
    318,
    ["Ambient"],
    2026,
  ),
  makeTrack(
    "track-horizon-line",
    "Horizon Line",
    "Tidal Memory",
    "artist-tide",
    "Sea Glass Cities",
    "album-sea-glass",
    356,
    ["Post-rock"],
    2026,
  ),
];

export const mockPlaylists: Playlist[] = [
  {
    id: "playlist-neon-focus",
    title: "Neon Focus",
    description: "Clear-headed electronics for the work that matters.",
    artwork: art("#111827", "#4338ca", "#67e8f9"),
    trackIds: [
      "track-soft-machines",
      "track-night-transit",
      "track-still-signal",
      "track-blue-exit",
      "track-rain-cache",
    ],
    tags: ["Focus", "Electronic", "Night"],
    owner: "Auralis",
  },
  {
    id: "playlist-slow-sunday",
    title: "Slow Sunday",
    description: "Warm rooms, unhurried mornings, nowhere else to be.",
    artwork: art("#422006", "#9a3412", "#fde68a"),
    trackIds: [
      "track-first-coffee",
      "track-open-window",
      "track-window-seat",
      "track-golden-hour",
      "track-paper-sun",
    ],
    tags: ["Calm", "Soul", "Lo-fi"],
    owner: "Auralis",
  },
  {
    id: "playlist-beyond-blue",
    title: "Beyond Blue",
    description: "Expansive songs for the long way home.",
    artwork: art("#172554", "#0369a1", "#a5f3fc"),
    trackIds: [
      "track-sea-glass",
      "track-afterlight",
      "track-horizon-line",
      "track-slow-motion",
      "track-low-tide",
    ],
    tags: ["Ambient", "Dream pop", "Wide screen"],
    owner: "Auralis",
  },
  {
    id: "playlist-night-drive",
    title: "Night Drive",
    description: "Tail lights, wet streets, and the next bright exit.",
    artwork: art("#09090b", "#6d28d9", "#fb7185"),
    trackIds: [
      "track-night-transit",
      "track-orbit",
      "track-magnetic",
      "track-afterlight",
      "track-blue-exit",
    ],
    tags: ["Night", "Synthwave", "Drive"],
    owner: "Auralis",
  },
];

const afterlightLrc = `[00:00.00]Afterlight
[00:10.00]We left the windows open to the rain
[00:25.00]Let every little room forget our names
[00:41.00]There is a quiet color in the street
[00:57.00]A fading pulse beneath our moving feet
[01:14.00]Stay where the evening turns to gold
[01:30.00]Stay while the city loses hold
[01:48.00]I will find you in the afterlight
[02:06.00]A silver signal on the other side
[02:24.00]All of the shadows learning how to shine
[02:42.00]I will find you in the afterlight
[03:05.00]When morning comes, we will be new`;

export const mockLyrics: Record<string, LyricDocument> = Object.fromEntries(
  mockTracks.map((track, index) => {
    const lrc =
      track.id === "track-afterlight"
        ? afterlightLrc
        : `[00:00.00]${track.title}
[00:14.00]The room is turning slowly into sound
[00:33.00]A gentle rhythm lifting from the ground
[00:52.00]We keep the moment close and let it breathe
[01:14.00]There is more here than the eye can see
[01:39.00]Every quiet color comes alive
[02:05.00]We follow where the open road arrives
[02:31.00]Stay with the song until the final light
[02:58.00]Everything is clear tonight`;
    return [
      track.id,
      {
        trackId: track.id,
        plainText: lrc
          .split("\n")
          .map((line) => line.replace(/\[[^\]]+\]/, ""))
          .join("\n"),
        lrc,
        offset: index % 2 === 0 ? 0 : 150,
        lines: parseLrc(lrc),
      },
    ];
  }),
);

export const featuredTrack = mockTracks[0];
export const recentTracks = mockTracks.slice(6, 12);

export function getTrack(id: string) {
  return mockTracks.find((track) => track.id === id);
}

export function getAlbum(id: string) {
  return mockAlbums.find((album) => album.id === id);
}

export function getArtist(id: string) {
  return mockArtists.find((artist) => artist.id === id);
}

export function getPlaylist(id: string) {
  return mockPlaylists.find((playlist) => playlist.id === id);
}

export function tracksFromIds(ids: string[]) {
  return ids.flatMap((id) => {
    const track = getTrack(id);
    return track ? [track] : [];
  });
}
