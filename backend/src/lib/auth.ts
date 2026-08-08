import type { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "./env.js";

/** Must match `SESSION_COOKIE` in the frontend's src/lib/session.ts. */
export const SESSION_COOKIE = "snug_session";

export type Role = "MEMBER" | "LISTENER" | "ADMIN";

export interface TokenPayload {
  /** User id. `sub` is the registered JWT claim for the subject. */
  sub: string;
  role: Role;
}

/** Cost 12: ~250ms per hash, slow enough to make offline cracking expensive. */
const BCRYPT_ROUNDS = 12;

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    // Expired, tampered with, or signed by something else — all the same to us.
    return null;
  }
}

/**
 * The token goes in an httpOnly cookie rather than the response body, so a
 * script that gets XSS on the frontend still cannot read or exfiltrate it.
 */
export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
  });
}
