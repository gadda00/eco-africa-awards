import { PrismaClient } from "@prisma/client";

/**
 * Robust Prisma client initialisation for both local dev and serverless (Netlify).
 *
 * - In local dev, SQLite is used via DATABASE_URL=file:./db/custom.db
 * - On Netlify, the same DATABASE_URL env var is set, pointing at a writable /tmp path
 *   so that each serverless function instance can create its own ephemeral DB.
 *
 * For production-grade persistence, set DATABASE_URL to a real Postgres connection
 * string (e.g. Neon, Supabase) and switch the Prisma datasource provider to "postgresql".
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
    });
  } catch (e) {
    console.error("Failed to instantiate Prisma client:", e);
    throw e;
  }
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
