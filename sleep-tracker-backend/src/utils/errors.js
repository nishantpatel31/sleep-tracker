import { CustomError } from "./custom-error.js";

/**
 * Base application error for generic server-side issues.
 */
export class AppError extends CustomError {
  constructor(message, code = 500, isPublic = false, type = "APP_ERROR", meta = {}) {
    super(message, code, isPublic, type, meta);
  }
}

/**
 * Represents a 400 Bad Request error.
 * Typically used when user input is invalid or malformed.
 */
export class BadRequestError extends AppError {
  constructor(message = "Bad request", meta = {}) {
    super(message, 400, true, "BAD_REQUEST", meta);
  }
}

/**
 * Represents a 404 Not Found error.
 * Used when a requested resource does not exist.
 */
export class NotFoundError extends AppError {
  constructor(message = "Not found", meta = {}) {
    super(message, 404, true, "RESOURCE_NOT_FOUND", meta);
  }
}

/**
 * Represents a 409 Conflict error due to duplicate unique keys.
 * Commonly used for duplicate usernames, emails, etc.
 */
export class DuplicateKeyError extends AppError {
  constructor(message = "Duplicate key error", meta = {}) {
    super(message, 409, true, "DUPLICATE_KEY", meta);
  }
}
