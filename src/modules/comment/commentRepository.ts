import { prisma } from "../../lib/prisma.js";

const commentWithRelations = {
  user: { select: { id: true, name: true, username: true, avatar: true } },
  replies: {
    include: {
      user: { select: { id: true, name: true, username: true, avatar: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

export const createComment = (data: { content: string; userId: string; theoryId: string; parentId?: string }) =>
  prisma.comment.create({
    data,
    include: commentWithRelations,
  });

export const findCommentById = (id: string) =>
  prisma.comment.findUnique({ where: { id } });

export const findCommentsByTheoryId = (theoryId: string, skip: number, take: number) =>
  prisma.comment.findMany({
    where: { theoryId, parentId: null }, 
    include: commentWithRelations,
    orderBy: { createdAt: "desc" as const }, 
    skip,
    take,
  });

export const countCommentsByTheoryId = (theoryId: string) =>
  prisma.comment.count({ where: { theoryId, parentId: null } });

export const updateComment = (id: string, data: { content: string }) =>
  prisma.comment.update({
    where: { id },
    data,
    include: commentWithRelations,
  });

export const deleteComment = (id: string) =>
  prisma.comment.delete({ where: { id } });