import { ok, badRequest } from "@/lib/api";
import { db } from "@/lib/db";
import { historySchema, parseJson } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = await parseJson(request, historySchema);
  if (parsed.error) return badRequest(parsed.error);
  if (db) {
    try {
      const history = await db.playHistory.create({
        data: {
          userKey: "local-user",
          trackId: parsed.data.trackId,
          playedAt: parsed.data.playedAt
            ? new Date(parsed.data.playedAt)
            : undefined,
        },
      });
      return ok({ data: history, persisted: true });
    } catch {}
  }
  return ok({
    data: {
      ...parsed.data,
      playedAt: parsed.data.playedAt ?? new Date().toISOString(),
    },
    persisted: false,
  });
}
