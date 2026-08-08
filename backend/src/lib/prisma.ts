import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "../generated/prisma/client.js";

/**
 * Prisma 7 requires a driver adapter — the client no longer opens its own
 * connection. `@prisma/adapter-mariadb` is the right one for MySQL as well as
 * MariaDB.
 *
 * The adapter takes the same URL the CLI uses, so there is one source of truth
 * for the connection: DATABASE_URL in .env.
 */
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

// A single client per process. Without this guard, `tsx watch` opens a new pool
// on every reload and MySQL eventually refuses connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
