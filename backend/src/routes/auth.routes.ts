import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

import {
  clearSessionCookie,
  hashPassword,
  setSessionCookie,
  signToken,
  verifyPassword,
} from "../lib/auth.js";
import { ApiError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const authRoutes = Router();

/** Blunt brute-force protection on the endpoints worth attacking. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again in a few minutes." },
});

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(191),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

const registerBody = credentials.extend({
  name: z.string().trim().min(1, "Tell us your name").max(120),
});

/** Never send passwordHash to the client, even by accident. */
const publicUser = { id: true, name: true, email: true, role: true, createdAt: true } as const;

authRoutes.post("/register", authLimiter, async (req, res) => {
  const { name, email, password } = registerBody.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("An account with that email already exists", "EMAIL_TAKEN");
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password) },
    select: publicUser,
  });

  setSessionCookie(res, signToken({ sub: user.id, role: user.role }));
  res.status(201).json({ user });
});

authRoutes.post("/login", authLimiter, async (req, res) => {
  const { email, password } = credentials.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });

  // Same message and roughly the same work either way, so the response can't be
  // used to discover which email addresses have accounts.
  const ok = user && (await verifyPassword(password, user.passwordHash));
  if (!user || !ok) throw ApiError.unauthorized("Email or password is incorrect");

  setSessionCookie(res, signToken({ sub: user.id, role: user.role }));
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  });
});

authRoutes.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

authRoutes.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: publicUser,
  });

  // Token still valid but the account is gone — treat as signed out.
  if (!user) {
    clearSessionCookie(res);
    throw ApiError.unauthorized();
  }

  res.json({ user });
});
