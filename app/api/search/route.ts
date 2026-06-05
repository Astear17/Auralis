import { ok, badRequest } from "@/lib/api";
import {
  mockAlbums,
  mockArtists,
  mockPlaylists,
  mockTracks,
} from "@/lib/mock-data";
import { searchQuerySchema } from "@/lib/validators";

export async function GET(request: Request) {
  const parsed = searchQuerySchema.safeParse(
    new URL(request.url).searchParams.get("q") ?? "",
  );
  if (!parsed.success) return badRequest(parsed.error.flatten());
  const query = parsed.data.toLowerCase();
  const includes = (...values: string[]) =>
    !query || values.some((value) => value.toLowerCase().includes(query));
  return ok({
    tracks: mockTracks.filter((track) =>
      includes(track.title, track.artist, track.album, ...track.genres),
    ),
    albums: mockAlbums.filter((album) =>
      includes(album.title, album.artist, ...album.genres),
    ),
    artists: mockArtists.filter((artist) =>
      includes(artist.name, ...artist.genres),
    ),
    playlists: mockPlaylists.filter((playlist) =>
      includes(playlist.title, playlist.description, ...playlist.tags),
    ),
  });
}
