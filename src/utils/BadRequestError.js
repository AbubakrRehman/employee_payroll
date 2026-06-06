import AppError from "./AppError.js";

class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    // 400 is the standard HTTP status code for Bad Request
    super(400, message); 
  }
}

export default BadRequestError;