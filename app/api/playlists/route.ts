import { ok, badRequest } from "@/lib/api";
import { runDatabase } from "@/lib/db";
import { mockPlaylists } from "@/lib/mock-data";
import { parseJson, playlistCreateSchema } from "@/lib/validators";

export async function GET() {
  const database = await runDatabase("list playlists", (client) =>
    client.playlist.findMany({
      orderBy: { updatedAt: "desc" },
    }),
  );
  if (database.ok && database.data.length) {
    return ok({ data: database.data, source: "database" });
  }
  return ok({
    data: mockPlaylists,
    source: "mock fallback",
    database: database.ok ? "connected but empty" : database.reason,
  });
}

export async function POST(request: Request) {
  const parsed = await parseJson(request, playlistCreateSchema);
  if (parsed.error) return badRequest(parsed.error);
  const database = await runDatabase("create playlist", (client) =>
    client.playlist.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        tags: [],
      },
    }),
  );
  if (database.ok) {
    return ok({ data: database.data, persisted: true }, { status: 201 });
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
      database: database.reason,
      note: "Created in fallback mode. Configure PostgreSQL for server persistence.",
    },
    { status: 201 },
  );
}
