import { Request, Response, NextFunction } from "express";
import * as theoryService from "./theoryService.js";
import sendResponse from "../../shared/utils/response.js";

export const createTheory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { caseId } = req.params;
    const created = await theoryService.createTheory(caseId as string, userId, req.body);
    sendResponse(res, 201, true, "Theory created successfully", created);
  } catch (error) {
    next(error);
  }
};

export const getTheoriesByCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const { caseId } = req.params;
    const theories = await theoryService.getTheoriesByCaseId(caseId as string, requester?.id, requester?.role);
    sendResponse(res, 200, true, "Theories fetched successfully", theories);
  } catch (error) {
    next(error);
  }
};

export const getTheory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const theory = await theoryService.getTheoryById(req.params.id as string, requester?.id, requester?.role);
    sendResponse(res, 200, true, "Theory fetched successfully", theory);
  } catch (error) {
    next(error);
  }
};

export const updateTheory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const updated = await theoryService.updateTheory(req.params.id as string, requester.id, requester.role, req.body);
    sendResponse(res, 200, true, "Theory updated successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTheory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    await theoryService.deleteTheory(req.params.id as string, requester.id, requester.role);
    sendResponse(res, 200, true, "Theory deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

export const upvoteTheory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await theoryService.upvoteTheory(req.params.id as string, userId);
    sendResponse(res, 200, true, "Theory upvoted successfully", null);
  } catch (error) {
    next(error);
  }
};

export const removeUpvote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await theoryService.removeUpvote(req.params.id as string, userId);
    sendResponse(res, 200, true, "Upvote removed successfully", null);
  } catch (error) {
    next(error);
  }
};