import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./lib/prisma.js";

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});

let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully...`);

  const forceExitTimeout = setTimeout(() => {
    console.error("Shutdown timed out after 30 seconds. Forcing exit.");
    process.exit(1);
  }, 30000);

  forceExitTimeout.unref();

  server.close(async () => {
    console.log("HTTP server closed.");

    try {
      await prisma.$disconnect();
      console.log("Prisma disconnected.");
    } catch (err) {
      console.error("Error disconnecting Prisma:", err.message);
    }

    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});
