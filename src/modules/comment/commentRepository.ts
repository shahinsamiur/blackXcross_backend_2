import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";

const commentWithRelations = {
  user: { select: { id: true, name: true, username: true, avatar: true } },
  replies: {
    include: {
      user: { select: { id: true, name: true, username: true, avatar: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
};
const authorSelect = { id: true, name: true, username: true, avatar: true };

const likeFields = (userId?: string) => ({
  _count: { select: { likes: true } },
  likes: { where: { userId: userId ?? "" }, select: { id: true } },
});

const commentWithLikes = (userId?: string) => ({
  user: { select: authorSelect },
  ...likeFields(userId),
  replies: {
    include: { user: { select: authorSelect }, ...likeFields(userId) },
    orderBy: { createdAt: "asc" as const },
  },
});
export const createComment = (data: {
  content: string;
  userId: string;
  theoryId: string;
  parentId?: string;
}) =>
  prisma.comment.create({
    data,
    include: commentWithRelations,
  });

export const findCommentById = (id: string) =>
  prisma.comment.findUnique({ where: { id } });

export const findCommentsByTheoryId = (
  theoryId: string,
  skip: number,
  take: number,
  userId?: string,
) =>
  prisma.comment.findMany({
    where: { theoryId, parentId: null },
    include: commentWithLikes(userId),
    orderBy: { createdAt: "desc" as const },
    skip,
    take,
  });

export const countCommentsByTheoryId = (theoryId: string) =>
  prisma.comment.count({ where: { theoryId, parentId: null } });

export const findAllComments = (
  where: Prisma.CommentWhereInput,
  skip: number,
  take: number,
) =>
  prisma.comment.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, username: true, avatar: true } },
      theory: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" as const },
    skip,
    take,
  });

export const countAllComments = (where: Prisma.CommentWhereInput) =>
  prisma.comment.count({ where });

export const updateComment = (id: string, data: { content: string }) =>
  prisma.comment.update({
    where: { id },
    data,
    include: commentWithRelations,
  });

export const deleteComment = (id: string) =>
  prisma.comment.delete({ where: { id } });
export const likeComment = (userId: string, commentId: string) =>
  prisma.commentLike.create({ data: { userId, commentId } });

export const unlikeComment = (userId: string, commentId: string) =>
  prisma.commentLike.deleteMany({ where: { userId, commentId } });
