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
const url = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),

  /**
   * MySQL 8 defaults to `caching_sha2_password`, which on a connection without
   * TLS requires fetching the server's RSA public key before the password can
   * be sent. The driver refuses to do that silently, failing with
   * ER_CANNOT_RETRIEVE_RSA_KEY — which Prisma then surfaces, unhelpfully, as a
   * connection-pool timeout.
   *
   * Enabling it is safe here because this connection is never exposed: in
   * production the database is on localhost, and from a developer machine it
   * runs inside an authenticated SSH tunnel. Neither path crosses a network
   * where a key could be substituted.
   */
  allowPublicKeyRetrieval: true,
});

// A single client per process. Without this guard, `tsx watch` opens a new pool
// on every reload and MySQL eventually refuses connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
