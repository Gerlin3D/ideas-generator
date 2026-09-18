import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString,
  // Keep the pool small and close idle connections quickly so a serverless
  // Postgres (Neon) can suspend its compute instead of staying awake 24/7.
  max: Number(process.env.DATABASE_POOL_MAX ?? 3),
  idleTimeoutMillis: Number(process.env.DATABASE_POOL_IDLE_TIMEOUT_MS ?? 10_000),
  allowExitOnIdle: true,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
