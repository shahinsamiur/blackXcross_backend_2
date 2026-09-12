import { prisma } from "../../lib/prisma.js";
export const findUserByEmail = (email) => prisma.user.findUnique({ where: { email } });
export const findUserById = (id) => prisma.user.findUnique({ where: { id } });
export const createUser = (data) => prisma.user.create({
    data: { name: data.name, email: data.email, password: data.password },
});
export const updateUserPassword = (id, password) => prisma.user.update({ where: { id }, data: { password } });
export const markEmailVerified = (id) => prisma.user.update({ where: { id }, data: { isEmailVerified: true } });
export const createRefreshToken = (data) => prisma.refreshToken.create({ data });
export const findRefreshTokenByHash = (tokenHash) => prisma.refreshToken.findUnique({ where: { tokenHash } });
export const revokeRefreshToken = (tokenHash, replacedByTokenHash) => prisma.refreshToken.update({
    where: { tokenHash },
    data: { revokedAt: new Date(), replacedByTokenHash },
});
export const revokeAllUserRefreshTokens = (userId) => prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
});
export const createVerificationToken = (data) => prisma.verificationToken.create({ data });
export const findVerificationTokenByHash = (tokenHash) => prisma.verificationToken.findUnique({ where: { tokenHash } });
export const markVerificationTokenUsed = (tokenHash) => prisma.verificationToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
});
