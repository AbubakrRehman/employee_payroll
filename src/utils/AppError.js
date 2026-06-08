class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    // Captures the stack trace, keeping our constructor out of it
    // Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;