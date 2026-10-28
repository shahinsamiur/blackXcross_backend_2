import { Request, Response, NextFunction } from "express";
import sendResponse from "../utils/response.js";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("FULL ERROR TRACE:", err);

  const statusCode: number = err.statusCode || 500;
  const message: string = err.message || "Internal Server Error";

  sendResponse(res, statusCode, false, message);
};

export default errorHandler;