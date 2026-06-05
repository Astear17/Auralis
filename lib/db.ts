import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL?.trim();

export const databaseConfigured = Boolean(databaseUrl);

const db = databaseConfigured
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    }))
  : null;

if (process.env.NODE_ENV !== "production" && db) globalForPrisma.prisma = db;

export type DatabaseFallbackReason = "not-configured" | "unavailable";

export type DatabaseAttempt<T> =
  | { ok: true; data: T }
  | { ok: false; reason: DatabaseFallbackReason };

export async function runDatabase<T>(
  operationName: string,
  operation: (client: PrismaClient) => Promise<T>,
  options: { logUnavailable?: boolean } = {},
): Promise<DatabaseAttempt<T>> {
  if (!db) return { ok: false, reason: "not-configured" };

  try {
    return { ok: true, data: await operation(db) };
  } catch {
    if (options.logUnavailable !== false) {
      console.warn(
        `[database] ${operationName} failed; continuing with the safe fallback.`,
      );
    }
    return { ok: false, reason: "unavailable" };
  }
}

export async function getDatabaseStatus() {
  const result = await runDatabase(
    "health check",
    (client) => client.$queryRaw`SELECT 1`,
    { logUnavailable: false },
  );

  if (result.ok) return "connected" as const;
  return result.reason === "not-configured"
    ? ("mock fallback" as const)
    : ("configured but unavailable" as const);
}
