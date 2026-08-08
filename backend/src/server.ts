import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./lib/env.js";
import { prisma } from "./lib/prisma.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { conversationRoutes } from "./routes/conversations.routes.js";
import { requestRoutes } from "./routes/requests.routes.js";

const app = express();

// Behind a proxy in production, so `secure` cookies and rate-limit IPs work.
if (env.isProduction) app.set("trust proxy", 1);

app.use(helmet());

/**
 * `credentials: true` is what lets the browser send our session cookie to a
 * different port. It requires an explicit origin allow-list — the spec forbids
 * `*` with credentials, and accepting any origin would let any site call this
 * API as your signed-in user.
 */
app.use(
  cors({
    origin(origin, callback) {
      // Same-origin and server-to-server calls arrive without an Origin header.
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} is not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true, env: env.NODE_ENV });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/conversations", conversationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
  console.log(`CORS origins: ${env.corsOrigins.join(", ")}`);
});

// Close connections cleanly so `tsx watch` restarts and container stops don't
// leave the MySQL pool hanging.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}
