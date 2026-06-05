import { ok, badRequest } from "@/lib/api";
import { runDatabase } from "@/lib/db";
import { historySchema, parseJson } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = await parseJson(request, historySchema);
  if (parsed.error) return badRequest(parsed.error);
  const database = await runDatabase("save play history", (client) =>
    client.playHistory.create({
      data: {
        userKey: "local-user",
        trackId: parsed.data.trackId,
        playedAt: parsed.data.playedAt
          ? new Date(parsed.data.playedAt)
          : undefined,
      },
    }),
  );
  if (database.ok) {
    return ok({ data: database.data, persisted: true });
  }
  return ok({
    data: {
      ...parsed.data,
      playedAt: parsed.data.playedAt ?? new Date().toISOString(),
    },
    persisted: false,
    database: database.reason,
  });
}
