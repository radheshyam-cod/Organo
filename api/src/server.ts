import "dotenv/config";
import app from "./app.js";
import prisma from "./utils/prisma.js";
import { env } from "./utils/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  shutdown("uncaughtException").catch(() => process.exit(1));
});
