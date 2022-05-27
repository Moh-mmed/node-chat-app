class AppError extends Error {
  // ! This is an ERROR Class for Server Error
  constructor(message, statusCode) {
    super(message); 

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    this.isOperational = true; 

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
