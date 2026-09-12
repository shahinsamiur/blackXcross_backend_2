import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import env from "../../config/env.js";

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isEmailVerified: true },
    });

    if (user) {
      (req as any).user = user;
    }
  } catch {
    // Invalid/expired token: continue as a guest rather than failing the request.
  }

  next();
};

export default optionalAuthMiddleware;