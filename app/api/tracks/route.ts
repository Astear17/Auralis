import { ok } from "@/lib/api";
import { databaseConfigured } from "@/lib/db";
import { mockTracks } from "@/lib/mock-data";

export async function GET() {
  return ok({
    data: mockTracks,
    source: databaseConfigured
      ? "mock catalog with database support"
      : "mock fallback",
  });
}
