import { ok, badRequest } from "@/lib/api";
import { runDatabase } from "@/lib/db";
import { getPlaylist } from "@/lib/mock-data";
import { idSchema, parseJson, playlistPatchSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return badRequest(parsedId.error.flatten());
  const parsed = await parseJson(request, playlistPatchSchema);
  if (parsed.error) return badRequest(parsed.error);
  const database = await runDatabase("update playlist", (client) =>
    client.playlist.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
      },
    }),
  );
  if (database.ok) {
    return ok({ data: database.data, persisted: true });
  }
  const playlist = getPlaylist(id);
  if (!playlist) return ok({ error: "Playlist not found" }, { status: 404 });
  return ok({
    data: { ...playlist, ...parsed.data },
    persisted: false,
    database: database.reason,
  });
}
