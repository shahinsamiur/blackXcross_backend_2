import { Request, Response, NextFunction } from "express";
import { Role } from "../../../generated/prisma/client.js";
import AppError from "../../shared/utils/AppError.js";

const adminMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (!user || user.role !== Role.ADMIN) {
    return next(new AppError("Forbidden: Admin access required", 403));
  }
  next();
};

export default adminMiddleware;