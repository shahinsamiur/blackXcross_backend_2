import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../../shared/utils/AppError.js";
import env from "../../config/env.js";
import * as authRepository from "./authRepository.js";
import { generateRawToken, hashToken } from "./authTokenUtils.js";
import { VerificationTokenType } from "../../../generated/prisma/client.js";
const toAuthUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
});
const generateAccessToken = (id, role) => jwt.sign({ id, role }, env.jwtSecret, { expiresIn: env.accessTokenExpiresIn });
const issueRefreshToken = async (userId) => {
    const rawToken = generateRawToken();
    const expiresAt = new Date(Date.now() + env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000);
    await authRepository.createRefreshToken({
        tokenHash: hashToken(rawToken),
        userId,
        expiresAt,
    });
    return rawToken;
};
const issueTokens = async (user) => ({
    token: generateAccessToken(user.id, user.role),
    refreshToken: await issueRefreshToken(user.id),
});
export const registerUser = async (data) => {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
        throw new AppError("Email already registered", 409);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const created = await authRepository.createUser({
        name: data.name,
        email: data.email,
        password: hashedPassword,
    });
    const rawVerifyToken = generateRawToken();
    await authRepository.createVerificationToken({
        tokenHash: hashToken(rawVerifyToken),
        userId: created.id,
        type: VerificationTokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    const user = toAuthUser(created);
    const tokens = await issueTokens(user);
    return { user, tokens };
};
export const loginUser = async (data) => {
    const found = await authRepository.findUserByEmail(data.email);
    if (!found) {
        throw new AppError("Invalid email or password", 401);
    }
    const isMatch = await bcrypt.compare(data.password, found.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }
    const user = toAuthUser(found);
    const tokens = await issueTokens(user);
    return { user, tokens };
};
export const logoutUser = async (rawRefreshToken) => {
    if (!rawRefreshToken)
        return;
    const tokenHash = hashToken(rawRefreshToken);
    const existing = await authRepository.findRefreshTokenByHash(tokenHash);
    if (existing && !existing.revokedAt) {
        await authRepository.revokeRefreshToken(tokenHash);
    }
};
export const refreshTokens = async (rawRefreshToken) => {
    if (!rawRefreshToken) {
        throw new AppError("Refresh token missing", 401);
    }
    const tokenHash = hashToken(rawRefreshToken);
    const existing = await authRepository.findRefreshTokenByHash(tokenHash);
    if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
        throw new AppError("Invalid or expired refresh token", 401);
    }
    const found = await authRepository.findUserById(existing.userId);
    if (!found) {
        throw new AppError("User not found", 404);
    }
    const user = toAuthUser(found);
    const newRawRefreshToken = generateRawToken();
    const expiresAt = new Date(Date.now() + env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000);
    await authRepository.createRefreshToken({
        tokenHash: hashToken(newRawRefreshToken),
        userId: user.id,
        expiresAt,
    });
    await authRepository.revokeRefreshToken(tokenHash, hashToken(newRawRefreshToken));
    return {
        token: generateAccessToken(user.id, user.role),
        refreshToken: newRawRefreshToken,
    };
};
export const verifyEmail = async (data) => {
    const tokenHash = hashToken(data.token);
    const record = await authRepository.findVerificationTokenByHash(tokenHash);
    if (!record ||
        record.usedAt ||
        record.expiresAt < new Date() ||
        record.type !== VerificationTokenType.EMAIL_VERIFICATION) {
        throw new AppError("Invalid or expired verification token", 400);
    }
    await authRepository.markEmailVerified(record.userId);
    await authRepository.markVerificationTokenUsed(tokenHash);
};
export const forgotPassword = async (data) => {
    const found = await authRepository.findUserByEmail(data.email);
    if (!found)
        return;
    const rawResetToken = generateRawToken();
    await authRepository.createVerificationToken({
        tokenHash: hashToken(rawResetToken),
        userId: found.id,
        type: VerificationTokenType.PASSWORD_RESET,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
};
export const resetPassword = async (data) => {
    const tokenHash = hashToken(data.token);
    const record = await authRepository.findVerificationTokenByHash(tokenHash);
    if (!record ||
        record.usedAt ||
        record.expiresAt < new Date() ||
        record.type !== VerificationTokenType.PASSWORD_RESET) {
        throw new AppError("Invalid or expired reset token", 400);
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await authRepository.updateUserPassword(record.userId, hashedPassword);
    await authRepository.markVerificationTokenUsed(tokenHash);
    await authRepository.revokeAllUserRefreshTokens(record.userId);
};
export const getMe = async (userId) => {
    const found = await authRepository.findUserById(userId);
    if (!found) {
        throw new AppError("User not found", 404);
    }
    return toAuthUser(found);
};
