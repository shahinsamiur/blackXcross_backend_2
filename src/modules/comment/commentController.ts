import { Request, Response, NextFunction } from "express";
import * as commentService from "./commentService.js";
import sendResponse from "../../shared/utils/response.js";

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { theoryId } = req.params;
    const created = await commentService.createComment({
      ...req.body,
      userId,
      theoryId,
    });
    sendResponse(res, 201, true, "Comment created successfully", created);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { theoryId } = req.params;
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);

    const result = await commentService.getCommentsByTheoryId(theoryId as string, page, limit);
    sendResponse(res, 200, true, "Comments fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const result = await commentService.getAllComments(requester?.role, { page, limit, search });
    sendResponse(res, 200, true, "Comments fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const createReply = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id: parentId } = req.params;

    const created = await commentService.createReply(parentId as string, userId, req.body.content);
    sendResponse(res, 201, true, "Reply created successfully", created);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const updated = await commentService.updateComment(req.params.id as string, requester.id, requester.role, req.body);
    sendResponse(res, 200, true, "Comment updated successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    await commentService.deleteComment(req.params.id as string, requester.id, requester.role);
    sendResponse(res, 200, true, "Comment deleted successfully", null);
  } catch (error) {
    next(error);
  }
};