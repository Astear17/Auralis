import { databaseConfigured, getDatabaseStatus } from "@/lib/db";
import { ok } from "@/lib/api";

export async function GET() {
  const database = await getDatabaseStatus();
  const mode =
    database === "connected"
      ? "database + fallback"
      : database === "configured but unavailable"
        ? "database unavailable, mock fallback active"
        : "mock fallback";

  return ok({
    status: "healthy",
    mode,
    database,
    databaseConfigured,
    deployment: process.env.RENDER ? "render" : "local",
    youtubeApi: process.env.YOUTUBE_API_KEY ? "configured" : "not configured",
    timestamp: new Date().toISOString(),
  });
}
