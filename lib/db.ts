import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const databaseConfigured = Boolean(process.env.DATABASE_URL);

export const db = databaseConfigured
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    }))
  : null;

if (process.env.NODE_ENV !== "production" && db) globalForPrisma.prisma = db;
