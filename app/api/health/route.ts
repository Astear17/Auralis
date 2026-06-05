import { db, databaseConfigured } from "@/lib/db";
import { ok } from "@/lib/api";

export async function GET() {
  let database = databaseConfigured ? "configured" : "mock fallback";
  if (db) {
    try {
      await db.$queryRaw`SELECT 1`;
      database = "connected";
    } catch {
      database = "configured but unavailable";
    }
  }
  return ok({
    status: "healthy",
    mode: databaseConfigured ? "database + fallback" : "mock fallback",
    database,
    youtubeApi: process.env.YOUTUBE_API_KEY ? "configured" : "not configured",
    timestamp: new Date().toISOString(),
  });
}
