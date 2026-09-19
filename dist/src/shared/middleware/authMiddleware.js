import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import env from "../../config/env.js";
import logger from "../logger/logger.js";
import { clearAuthCookies } from "../../modules/auth/authController.js";
const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;
    logger.info("token", token);
    if (!token) {
        return next(new AppError("Unauthorized, token missing", 401));
    }
    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, role: true, isEmailVerified: true },
        });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        if (user.status === "SUSPENDED") {
            return next(new AppError("Your account has been suspended", 403));
        }
        if (user.status === "BANNED") {
            return next(new AppError("Your account has been banned", 403));
        }
        req.user = user;
        next();
    }
    catch (err) {
        clearAuthCookies(res);
        return next(new AppError("Invalid or expired token", 401));
    }
};
export default authMiddleware;
