import { ok, badRequest } from "@/lib/api";
import { runDatabase } from "@/lib/db";
import { favoriteSchema, parseJson } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = await parseJson(request, favoriteSchema);
  if (parsed.error) return badRequest(parsed.error);
  const database = await runDatabase("save favorite", (client) =>
    client.favorite.upsert({
      where: {
        userKey_trackId: {
          userKey: "local-user",
          trackId: parsed.data.trackId,
        },
      },
      update: {},
      create: { userKey: "local-user", trackId: parsed.data.trackId },
    }),
  );
  if (database.ok) {
    return ok({ data: database.data, persisted: true });
  }
  return ok({
    data: parsed.data,
    persisted: false,
    database: database.reason,
  });
}

export async function DELETE(request: Request) {
  const parsed = await parseJson(request, favoriteSchema);
  if (parsed.error) return badRequest(parsed.error);
  const database = await runDatabase("delete favorite", (client) =>
    client.favorite.delete({
      where: {
        userKey_trackId: {
          userKey: "local-user",
          trackId: parsed.data.trackId,
        },
      },
    }),
  );
  if (database.ok) {
    return ok({ deleted: true, persisted: true });
  }
  return ok({ deleted: true, persisted: false, database: database.reason });
}
