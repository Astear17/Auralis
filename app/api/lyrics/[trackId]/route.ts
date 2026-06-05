import { ok, badRequest } from "@/lib/api";
import { runDatabase } from "@/lib/db";
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
  const database = await runDatabase("get lyrics", (client) =>
    client.lyric.findUnique({ where: { trackId } }),
  );
  if (database.ok && database.data) {
    return ok({
      ...database.data,
      lines: parseLrc(database.data.lrc ?? ""),
    });
  }
  const lyric = mockLyrics[trackId];
  return lyric
    ? ok(lyric)
    : ok(
        {
          error: "Lyrics not found",
          database: database.ok ? "connected but empty" : database.reason,
        },
        { status: 404 },
      );
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
  const database = await runDatabase("save lyrics", (client) =>
    client.lyric.upsert({
      where: { trackId },
      update: parsed.data,
      create: { trackId, ...parsed.data },
    }),
  );
  if (database.ok) {
    return ok({ data: database.data, persisted: true });
  }
  return ok({
    data: { trackId, ...parsed.data, lines: parseLrc(parsed.data.lrc) },
    persisted: false,
    database: database.reason,
  });
}
