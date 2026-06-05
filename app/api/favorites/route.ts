import { ok, badRequest } from "@/lib/api";
import { db } from "@/lib/db";
import { favoriteSchema, parseJson } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = await parseJson(request, favoriteSchema);
  if (parsed.error) return badRequest(parsed.error);
  if (db) {
    try {
      const favorite = await db.favorite.upsert({
        where: {
          userKey_trackId: {
            userKey: "local-user",
            trackId: parsed.data.trackId,
          },
        },
        update: {},
        create: { userKey: "local-user", trackId: parsed.data.trackId },
      });
      return ok({ data: favorite, persisted: true });
    } catch {}
  }
  return ok({ data: parsed.data, persisted: false });
}

export async function DELETE(request: Request) {
  const parsed = await parseJson(request, favoriteSchema);
  if (parsed.error) return badRequest(parsed.error);
  if (db) {
    try {
      await db.favorite.delete({
        where: {
          userKey_trackId: {
            userKey: "local-user",
            trackId: parsed.data.trackId,
          },
        },
      });
      return ok({ deleted: true, persisted: true });
    } catch {}
  }
  return ok({ deleted: true, persisted: false });
}
