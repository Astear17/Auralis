import { ok, badRequest } from "@/lib/api";
import { db } from "@/lib/db";
import { mockLyrics } from "@/lib/mock-data";
import { parseLrc } from "@/lib/lyrics/lrc";
import { idSchema, lyricSchema, parseJson } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackId: string }> },
) {
  const { trackId } = await params;
  const parsedId = idSchema.safeParse(trackId);
  if (!parsedId.success) return badRequest(parsedId.error.flatten());
  if (db) {
    try {
      const lyric = await db.lyric.findUnique({ where: { trackId } });
      if (lyric) return ok({ ...lyric, lines: parseLrc(lyric.lrc ?? "") });
    } catch {}
  }
  const lyric = mockLyrics[trackId];
  return lyric ? ok(lyric) : ok({ error: "Lyrics not found" }, { status: 404 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ trackId: string }> },
) {
  const { trackId } = await params;
  const parsedId = idSchema.safeParse(trackId);
  if (!parsedId.success) return badRequest(parsedId.error.flatten());
  const parsed = await parseJson(request, lyricSchema);
  if (parsed.error) return badRequest(parsed.error);
  if (db) {
    try {
      const lyric = await db.lyric.upsert({
        where: { trackId },
        update: parsed.data,
        create: { trackId, ...parsed.data },
      });
      return ok({ data: lyric, persisted: true });
    } catch {}
  }
  return ok({
    data: { trackId, ...parsed.data, lines: parseLrc(parsed.data.lrc) },
    persisted: false,
  });
}
