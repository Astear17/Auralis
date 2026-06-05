import { z } from "zod";

const videoIdSchema = z.string().regex(/^[a-zA-Z0-9_-]{11}$/);

export function extractYouTubeVideoId(input: string) {
  const value = input.trim();
  if (videoIdSchema.safeParse(value).success) return value;

  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") {
      const candidate = url.pathname.split("/").filter(Boolean)[0];
      return videoIdSchema.safeParse(candidate).success ? candidate : null;
    }
    if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
    ) {
      const candidate =
        url.searchParams.get("v") ??
        (url.pathname.startsWith("/shorts/") ||
        url.pathname.startsWith("/embed/")
          ? url.pathname.split("/")[2]
          : null);
      return videoIdSchema.safeParse(candidate).success ? candidate : null;
    }
  } catch {
    return null;
  }

  return null;
}
