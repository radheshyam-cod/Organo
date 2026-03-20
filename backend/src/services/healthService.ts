import prisma from "../utils/prisma.js";

export type HealthStatus = {
  status: "ok" | "degraded";
  uptime: number;
  timestamp: string;
  database: "up" | "down";
};

export async function getHealthStatus(): Promise<HealthStatus> {
  let database: HealthStatus["database"] = "down";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "up";
  } catch {
    database = "down";
  }

  return {
    status: database === "up" ? "ok" : "degraded",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database,
  };
}
