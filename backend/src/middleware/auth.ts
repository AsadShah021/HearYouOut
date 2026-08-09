import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../lib/errors.js";
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

/** Use after `requireAuth`. Staff-only endpoints must not be reachable by members. */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw ApiError.unauthorized();
    if (!roles.includes(req.user.role)) throw ApiError.forbidden();
    next();
  };
}
