import { prisma } from "../../lib/prisma.js";
import { VerificationTokenType } from "../../../generated/prisma/client.js";

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const findUserById = (id: string) =>
  prisma.user.findUnique({ where: { id } });

export const createUser = (data: { name: string; email: string; password: string }) =>
  prisma.user.create({
    data: { name: data.name, email: data.email, password: data.password },
  });

export const updateUserPassword = (id: string, password: string) =>
  prisma.user.update({ where: { id }, data: { password } });

export const markEmailVerified = (id: string) =>
  prisma.user.update({ where: { id }, data: { isEmailVerified: true } });

export const createRefreshToken = (data: {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}) => prisma.refreshToken.create({ data });

export const findRefreshTokenByHash = (tokenHash: string) =>
  prisma.refreshToken.findUnique({ where: { tokenHash } });

export const revokeRefreshToken = (tokenHash: string, replacedByTokenHash?: string) =>
  prisma.refreshToken.update({
    where: { tokenHash },
    data: { revokedAt: new Date(), replacedByTokenHash },
  });

export const revokeAllUserRefreshTokens = (userId: string) =>
  prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

export const createVerificationToken = (data: {
  tokenHash: string;
  userId: string;
  type: VerificationTokenType;
  expiresAt: Date;
}) => prisma.verificationToken.create({ data });

export const findVerificationTokenByHash = (tokenHash: string) =>
  prisma.verificationToken.findUnique({ where: { tokenHash } });

export const markVerificationTokenUsed = (tokenHash: string) =>
  prisma.verificationToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });