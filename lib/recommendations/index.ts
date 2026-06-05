import type { Playlist, Track } from "@/lib/types";

type RecommendationInput = {
  tracks: Track[];
  recentIds?: string[];
  favoriteIds?: string[];
  playlists?: Playlist[];
  limit?: number;
};

export function recommendTracks({
  tracks,
  recentIds = [],
  favoriteIds = [],
  playlists = [],
  limit = 10,
}: RecommendationInput) {
  const affinityIds = new Set([
    ...recentIds,
    ...favoriteIds,
    ...playlists.flatMap((playlist) => playlist.trackIds),
  ]);
  const affinityTracks = tracks.filter((track) => affinityIds.has(track.id));
  const genreScores = new Map<string, number>();
  const artistScores = new Map<string, number>();

  affinityTracks.forEach((track) => {
    track.genres.forEach((genre) =>
      genreScores.set(genre, (genreScores.get(genre) ?? 0) + 1),
    );
    artistScores.set(
      track.artistId,
      (artistScores.get(track.artistId) ?? 0) + 1,
    );
  });

  return [...tracks]
    .filter((track) => !recentIds.includes(track.id))
    .map((track, index) => ({
      track,
      score:
        track.genres.reduce(
          (sum, genre) => sum + (genreScores.get(genre) ?? 0) * 3,
          0,
        ) +
        (artistScores.get(track.artistId) ?? 0) * 4 +
        (favoriteIds.includes(track.id) ? 2 : 0) +
        (tracks.length - index) / tracks.length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ track }) => track);
}
