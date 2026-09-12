import { Request, Response, NextFunction } from "express";
import * as moderationService from "./moderationService.js";
import sendResponse from "../../shared/utils/response.js";

export const checkCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await moderationService.checkCase(req.body.caseId);
    sendResponse(res, 200, true, "Case moderation check completed", result);
  } catch (error) {
    next(error);
  }
};

export const checkImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await moderationService.checkImage(req.body.fileUrl, req.body.targetType, req.body.targetId);
    sendResponse(res, 200, true, "Image moderation check completed", result);
  } catch (error) {
    next(error);
  }
};

export const getModerationQueue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const targetType = typeof req.query.targetType === "string" ? req.query.targetType : undefined;

    const result = await moderationService.getModerationQueue({ page, limit, status, targetType });
    sendResponse(res, 200, true, "Moderation queue fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getModerationItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await moderationService.getModerationItemById(req.params.id as string);
    sendResponse(res, 200, true, "Moderation item fetched successfully", item);
  } catch (error) {
    next(error);
  }
};

export const approveModeration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const updated = await moderationService.approveModeration(req.params.id as string, adminId);
    sendResponse(res, 200, true, "Item approved successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const rejectModeration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const updated = await moderationService.rejectModeration(req.params.id as string, adminId);
    sendResponse(res, 200, true, "Item rejected successfully", updated);
  } catch (error) {
    next(error);
  }
};