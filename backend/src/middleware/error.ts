import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ApiError } from "../lib/errors.js";
import { env } from "../lib/env.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`No route for ${req.method} ${req.path}`));
}

/**
 * The single place errors become responses.
 *
 * Only `ApiError` and validation failures describe themselves to the client.
 * Everything else is a bug, so it is logged in full server-side and reported as
 * a bare 500 — an unhandled Prisma error can otherwise leak table names, and a
 * stack trace leaks file paths.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Some details need fixing",
      code: "VALIDATION_ERROR",
      fields: error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.status).json({ error: error.message, code: error.code });
  }

  console.error("[unhandled]", error);
  return res.status(500).json({
    error: "Something went wrong on our end",
    code: "INTERNAL_ERROR",
    ...(env.isProduction ? {} : { detail: String(error) }),
  });
}
