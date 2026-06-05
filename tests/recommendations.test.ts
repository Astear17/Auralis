import { describe, expect, it } from "vitest";
import { mockTracks } from "@/lib/mock-data";
import { recommendTracks } from "@/lib/recommendations";

describe("recommendTracks", () => {
  it("prefers related genres and excludes recent tracks", () => {
    const result = recommendTracks({
      tracks: mockTracks,
      recentIds: ["track-soft-machines"],
      favoriteIds: ["track-still-signal"],
      limit: 4,
    });
    expect(result).toHaveLength(4);
    expect(result.some((track) => track.id === "track-soft-machines")).toBe(
      false,
    );
    expect(
      result[0].genres.some((genre) =>
        ["Ambient", "Downtempo"].includes(genre),
      ),
    ).toBe(true);
  });
});
