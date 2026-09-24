import { Request, Response, NextFunction } from "express";
import * as authService from "./authService.js";
import sendResponse from "../../shared/utils/response.js";
import env from "../../config/env.js";

const ACCESS_TOKEN_COOKIE = "token";
const REFRESH_TOKEN_COOKIE = "refreshToken";

const accessCookieOptions = {
  httpOnly: true,
  secure: true, 
  sameSite: "lax" as const, 
  path: "/", 
  maxAge: 30 * 24 * 60 * 60 * 1000, 
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000,
};

const setAuthCookies = (res: Response, token: string, refreshToken: string): void => {
  res.cookie(ACCESS_TOKEN_COOKIE, token, accessCookieOptions);
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions);
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie(ACCESS_TOKEN_COOKIE, { path: "/", secure: true, sameSite: "none" });
  res.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/", secure: true, sameSite: "none" });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, tokens } = await authService.registerUser(req.body);
    setAuthCookies(res, tokens.token, tokens.refreshToken);
    sendResponse(res, 201, true, "User registered successfully", user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, tokens } = await authService.loginUser(req.body);
    setAuthCookies(res, tokens.token, tokens.refreshToken);
    sendResponse(res, 200, true, "Login successful", user);
  } catch (error) {
    next(error);
  }
};
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    clearAuthCookies(res);
    const user = (req as any).user;
    if (user?.id) {
      await authService.logoutUser(user.id);
    } else {
      console.warn("Logout: No authenticated user found in request, but cookies cleared.");
    }
    
    sendResponse(res, 200, true, "Logout successful", null);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tokens = await authService.refreshTokens(req.cookies?.[REFRESH_TOKEN_COOKIE]);
    setAuthCookies(res, tokens.token, tokens.refreshToken);
    sendResponse(res, 200, true, "Token refreshed", null);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authService.verifyEmail(req.body);
    sendResponse(res, 200, true, "Email verified successfully", null);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authService.forgotPassword(req.body);
    sendResponse(res, 200, true, "If that email is registered, a reset link has been sent", null);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authService.resetPassword(req.body);
    sendResponse(res, 200, true, "Password reset successful", null);
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authService.getMe((req as any).user.id);
    sendResponse(res, 200, true, "Current user", user);
  } catch (error) {
    next(error);
  }
};