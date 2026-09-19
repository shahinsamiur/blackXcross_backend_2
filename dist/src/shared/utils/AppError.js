import logger from "../logger/logger.js";
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Marks this as an expected, operational error
        // Ensures instanceof checks work correctly in TypeScript
        Object.setPrototypeOf(this, AppError.prototype);
        // Log the error when it is instantiated
        logger.warn(`AppError: ${message} | Status: ${statusCode}`);
    }
}
export default AppError;
