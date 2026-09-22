import logger from "../logger/logger.js";

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; 
  
    Object.setPrototypeOf(this, AppError.prototype);
    
    logger.warn(`AppError: ${message} | Status: ${statusCode}`);
  }
}

export default AppError;