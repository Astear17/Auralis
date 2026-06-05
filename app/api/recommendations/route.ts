import { ok } from "@/lib/api";
import { mockPlaylists, mockTracks, recentTracks } from "@/lib/mock-data";
import { recommendTracks } from "@/lib/recommendations";

export async function GET() {
  const recommendations = recommendTracks({
    tracks: mockTracks,
    recentIds: recentTracks.slice(0, 3).map((track) => track.id),
    favoriteIds: ["track-afterlight", "track-soft-machines"],
    playlists: mockPlaylists.slice(0, 2),
    limit: 12,
  });
  return ok({ data: recommendations, source: "local recommendation engine" });
}
