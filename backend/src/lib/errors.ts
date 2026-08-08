/**
 * Errors we deliberately expose to the client. Anything else that reaches the
 * error handler is treated as a bug and reported as a generic 500, so internal
 * details and stack traces never leak into a response.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message = "Bad request", code?: string) {
    return new ApiError(400, message, code);
  }
  static unauthorized(message = "Not signed in") {
    return new ApiError(401, message, "UNAUTHORIZED");
  }
  static forbidden(message = "Not allowed") {
    return new ApiError(403, message, "FORBIDDEN");
  }
  static notFound(message = "Not found") {
    return new ApiError(404, message, "NOT_FOUND");
  }
  static conflict(message = "Already exists", code?: string) {
    return new ApiError(409, message, code);
  }
}
