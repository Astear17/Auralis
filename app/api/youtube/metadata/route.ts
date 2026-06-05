import { ok, badRequest, unavailable } from "@/lib/api";
import { videoIdSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const videoId = new URL(request.url).searchParams.get("videoId") ?? "";
  const parsed = videoIdSchema.safeParse(videoId);
  if (!parsed.success) return badRequest(parsed.error.flatten());
  if (!process.env.YOUTUBE_API_KEY)
    return unavailable("YOUTUBE_API_KEY is not configured.");

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("id", parsed.data);
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok)
    return unavailable("The official YouTube Data API request failed.");
  const data = await response.json();
  return ok({
    data: data.items?.[0] ?? null,
    source: "official YouTube Data API",
  });
}
