import { prisma } from "../../lib/prisma.js";

const theoryWithRelations = {
  user: { select: { id: true, name: true, username: true, avatar: true } },
  _count: { select: { upvotes: true, comments: true } },
};

export const createTheory = (data: { title: string; content?: string; userId: string; caseId: string }) =>
  prisma.theory.create({
    data,
    include: theoryWithRelations,
  });

export const findTheoryById = (id: string) =>
  prisma.theory.findUnique({
    where: { id },
    include: theoryWithRelations,
  });

export const findTheoriesByCaseId = (caseId: string) =>
  prisma.theory.findMany({
    where: { caseId },
    include: theoryWithRelations,
    orderBy: { createdAt: "desc" as const },
  });

export const updateTheory = (id: string, data: { title?: string; content?: string }) =>
  prisma.theory.update({
    where: { id },
    data,
    include: theoryWithRelations,
  });

export const deleteTheory = (id: string) =>
  prisma.theory.delete({ where: { id } });

export const upvoteTheory = (userId: string, theoryId: string) =>
  prisma.theoryUpvote.create({
    data: { userId, theoryId },
  });

export const removeUpvote = (userId: string, theoryId: string) =>
  prisma.theoryUpvote.deleteMany({
    where: { userId, theoryId },
  });