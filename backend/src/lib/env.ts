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

  /**
   * Public origin of the site, used to build the OAuth redirect URI and to send
   * people back after signing in. Defaults to the first CORS origin.
   */
  APP_URL: z.string().url().optional(),

  /**
   * Public origin of this API, used only to build the OAuth redirect URI.
   *
   * In production nginx serves the app and the API on one origin, so this is
   * the same as APP_URL and can be left unset. In local development they are
   * different ports (app :3000, API :4000) and Google must be sent back to the
   * API, not the app — so set it explicitly there.
   */
  API_URL: z.string().url().optional(),

  /**
   * Google sign-in. Optional — leave unset and the Google routes return a clear
   * "not configured" error rather than the server refusing to boot.
   */
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  /**
   * Transactional email, via Resend.
   *
   * Optional so local development doesn't need an API key — with it unset,
   * codes are logged to the console instead of sent. That fallback is refused
   * in production: silently not sending verification codes would lock every
   * new signup out of the site.
   */
  RESEND_API_KEY: z.string().optional(),
  /** Must be on a domain verified in Resend, or delivery fails. */
  EMAIL_FROM: z.string().default("SnugTalk <hello@snugtalk.tech>"),
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

const corsOrigins = parsed.data.CORS_ORIGIN.split(",").map((o) => o.trim());

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === "production",
  corsOrigins,
  appUrl: (parsed.data.APP_URL ?? corsOrigins[0]!).replace(/\/$/, ""),
  apiUrl: (parsed.data.API_URL ?? parsed.data.APP_URL ?? corsOrigins[0]!).replace(/\/$/, ""),
  googleConfigured: Boolean(
    parsed.data.GOOGLE_CLIENT_ID && parsed.data.GOOGLE_CLIENT_SECRET,
  ),
  emailConfigured: Boolean(parsed.data.RESEND_API_KEY),
};

// Verification codes are the only way into the site for a new account. Booting
// production without a mail provider would turn every signup into a dead end,
// so fail loudly here rather than at 3am in somebody's inbox.
if (env.isProduction && !env.emailConfigured) {
  console.error(
    "\n✖ RESEND_API_KEY is required in production — without it, no signup can verify their email.\n",
  );
  process.exit(1);
}
