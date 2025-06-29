export class CustomError extends Error {
  /**
   * @param {string} message - Human-readable error message.
   * @param {number} code - HTTP status code (default: 400).
   * @param {boolean} isPublic - Whether message should be shown to client.
   * @param {string} [type] - Internal error identifier (e.g. "NICKNAME_EXISTS").
   * @param {object} [meta] - Additional debug info (not exposed in production).
   */
  constructor(message, code = 400, isPublic = false, type = "CUSTOM_ERROR", meta = {}) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.isPublic = isPublic;
    this.type = type;
    this.meta = meta;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Returns a JSON-serializable error response structure
   * @param {boolean} showMeta - Whether to include meta info
   * @param {boolean} showStack - Whether to include stack trace
   */
  toResponse(showMeta = false, showStack = false) {
    const errObj = {
      success: false,
      code: this.code,
      error: {
        name: this.name,
        message: this.isPublic ? this.message : "Something went wrong.",
        type: this.type
      }
    };

    if (showMeta && Object.keys(this.meta).length > 0) {
      errObj.error.meta = this.meta;
    }

    if (showStack && this.stack) {
      errObj.error.stack = this.stack;
    }

    return errObj;
  }
}
