import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { SESSION_COOKIE, verifyToken, type Role } from "../lib/auth.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: Role; impersonatedBy?: string };
    }
  }
}

/**
 * Reads the session cookie and attaches the caller to the request.
 *
 * The identity always comes from the signed token — never from a header, query
 * param or request body, any of which the client controls.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) throw ApiError.unauthorized();

  const payload = verifyToken(token);
  if (!payload) throw ApiError.unauthorized("Session expired — please sign in again");

  req.user = { id: payload.sub, role: payload.role, impersonatedBy: payload.imp };
  next();
}

/**
 * Use after `requireAuth`. Blocks anyone who hasn't proven their email address.
 *
 * Checked against the database rather than the token: verifying must take
 * effect immediately, and a token issued at signup would otherwise keep saying
 * "unverified" until it expired.
 *
 * The `EMAIL_UNVERIFIED` code is what the frontend keys on to send them to the
 * verify screen instead of showing a bare error.
 */
export async function requireVerified(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) throw ApiError.unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { isVerified: true },
  });

  if (!user) throw ApiError.unauthorized();
  if (!user.isVerified) {
    throw new ApiError(403, "Verify your email address to continue", "EMAIL_UNVERIFIED");
  }

  next();
}

/** Use after `requireAuth`. Staff-only endpoints must not be reachable by members. */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw ApiError.unauthorized();
    if (!roles.includes(req.user.role)) throw ApiError.forbidden();
    next();
  };
}
