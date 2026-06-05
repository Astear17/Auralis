import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

type EnvVar = {
  key: string;
  value?: string;
  generateValue?: boolean;
  sync?: boolean;
  fromDatabase?: { name: string; property: string };
};

type Blueprint = {
  services: Array<{
    type: string;
    name: string;
    runtime: string;
    plan: string;
    region: string;
    autoDeployTrigger: string;
    buildCommand: string;
    startCommand: string;
    healthCheckPath: string;
    envVars: EnvVar[];
  }>;
  databases: Array<{
    name: string;
    databaseName: string;
    user: string;
    plan: string;
    region: string;
    ipAllowList: string[];
  }>;
};

describe("Render Blueprint", () => {
  const blueprint = parse(
    readFileSync(resolve(process.cwd(), "render.yaml"), "utf8"),
  ) as Blueprint;

  it("provisions one free web service and one free private Postgres database", () => {
    expect(blueprint.services).toHaveLength(1);
    expect(blueprint.databases).toHaveLength(1);
    expect(blueprint.services[0]).toMatchObject({
      type: "web",
      name: "auralis-web",
      runtime: "node",
      plan: "free",
      region: "singapore",
      autoDeployTrigger: "off",
      startCommand: "npm run start",
      healthCheckPath: "/api/health",
    });
    expect(blueprint.databases[0]).toMatchObject({
      name: "auralis-db",
      databaseName: "auralis",
      user: "auralis",
      plan: "free",
      region: "singapore",
      ipAllowList: [],
    });
  });

  it("binds Postgres, generates secrets, and runs the Render migration build", () => {
    const service = blueprint.services[0];
    const env = Object.fromEntries(
      service.envVars.map((item) => [item.key, item]),
    );

    expect(service.buildCommand).toContain("npm run render:build");
    expect(env.DATABASE_URL.fromDatabase).toEqual({
      name: "auralis-db",
      property: "connectionString",
    });
    expect(env.APP_SECRET.generateValue).toBe(true);
    expect(env.NEXTAUTH_SECRET.generateValue).toBe(true);
    expect(env.NEXTAUTH_URL.value).toBe("https://auralis-web.onrender.com");
    expect(env.YOUTUBE_API_KEY.sync).toBe(false);
  });
});
