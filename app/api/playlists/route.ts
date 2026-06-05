import { ok, badRequest } from "@/lib/api";
import { db } from "@/lib/db";
import { mockPlaylists } from "@/lib/mock-data";
import { parseJson, playlistCreateSchema } from "@/lib/validators";

export async function GET() {
  if (db) {
    try {
      const playlists = await db.playlist.findMany({
        orderBy: { updatedAt: "desc" },
      });
      if (playlists.length) return ok({ data: playlists, source: "database" });
    } catch {}
  }
  return ok({ data: mockPlaylists, source: "mock fallback" });
}

export async function POST(request: Request) {
  const parsed = await parseJson(request, playlistCreateSchema);
  if (parsed.error) return badRequest(parsed.error);
  if (db) {
    try {
      const playlist = await db.playlist.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          tags: [],
        },
      });
      return ok({ data: playlist, persisted: true }, { status: 201 });
    } catch {}
  }
  return ok(
    {
      data: {
        id: `playlist-${crypto.randomUUID()}`,
        ...parsed.data,
        owner: "You",
        tags: [],
        artwork: {
          primary: "#312e81",
          secondary: "#164e63",
          accent: "#c4b5fd",
        },
      },
      persisted: false,
      note: "Created in fallback mode. Configure PostgreSQL for server persistence.",
    },
    { status: 201 },
  );
}
