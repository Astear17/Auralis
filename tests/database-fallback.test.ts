import { afterEach, describe, expect, it, vi } from "vitest";

describe("database fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("does not execute database operations when DATABASE_URL is missing", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const { databaseConfigured, runDatabase } = await import("@/lib/db");
    const operation = vi.fn();

    expect(databaseConfigured).toBe(false);
    await expect(runDatabase("fallback test", operation)).resolves.toEqual({
      ok: false,
      reason: "not-configured",
    });
    expect(operation).not.toHaveBeenCalled();
  });

  it("falls back when a configured database operation is unavailable", async () => {
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://auralis:auralis@localhost:5432/auralis?schema=public",
    );
    const { databaseConfigured, runDatabase } = await import("@/lib/db");

    expect(databaseConfigured).toBe(true);
    await expect(
      runDatabase(
        "unavailable test",
        async () => {
          throw new Error("connection unavailable");
        },
        { logUnavailable: false },
      ),
    ).resolves.toEqual({ ok: false, reason: "unavailable" });
  });
});
