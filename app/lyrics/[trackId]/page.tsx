import type { Metadata } from "next";
import { LyricsRoute } from "@/components/lyrics/lyrics-route";
import { getTrack, mockLyrics } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Lyrics" };
export default async function LyricsPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;
  return (
    <LyricsRoute
      trackId={trackId}
      initialTrack={getTrack(trackId)}
      initialLyric={mockLyrics[trackId]}
    />
  );
}
