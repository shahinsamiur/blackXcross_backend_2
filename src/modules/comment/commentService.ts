import AppError from "../../shared/utils/AppError.js";
import { Role } from "../../../generated/prisma/client.js";
import * as commentRepository from "./commentRepository.js";
import { UpdateCommentInput } from "./commentTypes.js";

const assertOwner = (comment: { userId: string }, requesterId: string, requesterRole: Role) => {
  if (comment.userId !== requesterId && requesterRole !== Role.ADMIN) {
    throw new AppError("You do not have permission to modify this comment", 403);
  }
};

export const createComment = async (data: { content: string; userId: string; theoryId: string; parentId?: string }) => {
  if (data.parentId) {
    const parent = await commentRepository.findCommentById(data.parentId);
    if (!parent) {
      throw new AppError("Parent comment not found", 404);
    }
    if (parent.theoryId !== data.theoryId) {
      throw new AppError("Parent comment does not belong to this theory", 400);
    }
  }
  return commentRepository.createComment(data);
};

export const createReply = async (parentId: string, userId: string, content: string) => {
  const parent = await commentRepository.findCommentById(parentId);
  if (!parent) {
    throw new AppError("Parent comment not found", 404);
  }
  
  return commentRepository.createComment({
    content,
    userId,
    theoryId: parent.theoryId,
    parentId: parent.id,
  });
};

export const getCommentsByTheoryId = async (theoryId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    commentRepository.findCommentsByTheoryId(theoryId, skip, limit),
    commentRepository.countCommentsByTheoryId(theoryId),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateComment = async (id: string, requesterId: string, requesterRole: Role, data: UpdateCommentInput) => {
  const comment = await commentRepository.findCommentById(id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }
  assertOwner(comment, requesterId, requesterRole);
  return commentRepository.updateComment(id, data);
};

export const deleteComment = async (id: string, requesterId: string, requesterRole: Role) => {
  const comment = await commentRepository.findCommentById(id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }
  assertOwner(comment, requesterId, requesterRole);
  await commentRepository.deleteComment(id);
};