import AppError from "./AppError.js";

class NotFoundError extends AppError {
  constructor(message = "NotFoundError") {
    // 400 is the standard HTTP status code for Bad Request
    super(404, message); 
  }
}

export default NotFoundError;