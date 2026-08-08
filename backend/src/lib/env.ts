import "dotenv/config";
import { z } from "zod";

/**
 * Validate configuration once, at boot.
 *
 * A missing or weak secret should stop the process immediately with a readable
 * message — not surface as a confusing 500 under load, or worse, silently sign
 * tokens with `undefined`.
 */
const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters — generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""),
  JWT_EXPIRES_IN: z.string().default("7d"),
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Comma-separated list of origins allowed to send credentialed requests. */
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("\n✖ Invalid environment configuration:\n");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error("\nCheck backend/.env against backend/.env.example.\n");
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === "production",
  corsOrigins: parsed.data.CORS_ORIGIN.split(",").map((o) => o.trim()),
};
