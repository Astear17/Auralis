import { z } from "zod";

export const idSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9_-]+$/);
export const videoIdSchema = z
  .string()
  .length(11)
  .regex(/^[a-zA-Z0-9_-]+$/);
export const searchQuerySchema = z.string().trim().max(100).default("");

export const playlistCreateSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240).default(""),
  trackIds: z.array(idSchema).max(500).default([]),
});

export const playlistPatchSchema = playlistCreateSchema.partial();

export const favoriteSchema = z.object({
  trackId: idSchema,
});

export const historySchema = z.object({
  trackId: idSchema,
  playedAt: z.string().datetime().optional(),
});

export const lyricSchema = z.object({
  lrc: z.string().max(100_000).default(""),
  plainText: z.string().max(100_000).default(""),
  offset: z.number().int().min(-30_000).max(30_000).default(0),
});

export async function parseJson<T>(request: Request, schema: z.ZodSchema<T>) {
  try {
    const data: unknown = await request.json();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return { data: null, error: parsed.error.flatten() } as const;
    }
    return { data: parsed.data, error: null } as const;
  } catch {
    return {
      data: null,
      error: { formErrors: ["Invalid JSON body"], fieldErrors: {} },
    } as const;
  }
}
