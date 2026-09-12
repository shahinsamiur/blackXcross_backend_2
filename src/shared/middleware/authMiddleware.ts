import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import env from "../../config/env.js";

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError("Unauthorized, token missing", 401));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isEmailVerified: true },
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if ((user as any).status === "SUSPENDED") {
      return next(new AppError("Your account has been suspended", 403));
    }

    if ((user as any).status === "BANNED") {
      return next(new AppError("Your account has been banned", 403));
    }

    (req as any).user = user;

    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export default authMiddleware;