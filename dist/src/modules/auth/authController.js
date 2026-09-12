import * as authService from "./authService.js";
import sendResponse from "../../shared/utils/response.js";
import env from "../../config/env.js";
const ACCESS_TOKEN_COOKIE = "token";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
};
const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000,
};
const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessCookieOptions);
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions);
};
const clearAuthCookies = (res) => {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
};
export const register = async (req, res, next) => {
    try {
        const { user, tokens } = await authService.registerUser(req.body);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        sendResponse(res, 201, true, "User registered successfully", user);
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const { user, tokens } = await authService.loginUser(req.body);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        sendResponse(res, 200, true, "Login successful", user);
    }
    catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        await authService.logoutUser(req.cookies?.[REFRESH_TOKEN_COOKIE]);
        clearAuthCookies(res);
        sendResponse(res, 200, true, "Logout successful", null);
    }
    catch (error) {
        next(error);
    }
};
export const refresh = async (req, res, next) => {
    try {
        const tokens = await authService.refreshTokens(req.cookies?.[REFRESH_TOKEN_COOKIE]);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        sendResponse(res, 200, true, "Token refreshed", null);
    }
    catch (error) {
        next(error);
    }
};
export const verifyEmail = async (req, res, next) => {
    try {
        await authService.verifyEmail(req.body);
        sendResponse(res, 200, true, "Email verified successfully", null);
    }
    catch (error) {
        next(error);
    }
};
export const forgotPassword = async (req, res, next) => {
    try {
        await authService.forgotPassword(req.body);
        sendResponse(res, 200, true, "If that email is registered, a reset link has been sent", null);
    }
    catch (error) {
        next(error);
    }
};
export const resetPassword = async (req, res, next) => {
    try {
        await authService.resetPassword(req.body);
        sendResponse(res, 200, true, "Password reset successful", null);
    }
    catch (error) {
        next(error);
    }
};
export const me = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.id);
        sendResponse(res, 200, true, "Current user", user);
    }
    catch (error) {
        next(error);
    }
};
