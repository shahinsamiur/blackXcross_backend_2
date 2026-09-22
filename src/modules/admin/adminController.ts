import { Request, Response, NextFunction } from "express";
import * as adminService from "./adminService.js";
import sendResponse from "../../shared/utils/response.js";

export const getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await adminService.getDashboard();
    sendResponse(res, 200, true, "Dashboard fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const role = typeof req.query.role === "string" ? req.query.role : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const result = await adminService.getUsers({ page, limit, search, role, status });
    sendResponse(res, 200, true, "Users fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const suspendUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await adminService.suspendUser(req.params.id as string);
    sendResponse(res, 200, true, "User suspended successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await adminService.banUser(req.params.id as string);
    sendResponse(res, 200, true, "User banned successfully", updated);
  } catch (error) {
    next(error);
  }
};


export const getCases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const publishState = typeof req.query.publishState === "string" ? req.query.publishState : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const result = await adminService.getCases({ page, limit, search, publishState, category });
    sendResponse(res, 200, true, "Cases fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const deleteCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await adminService.deleteCase(req.params.id as string);
    sendResponse(res, 200, true, "Case deleted successfully", null);
  } catch (error) {
    next(error);
  }
};


export const getReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const targetType = typeof req.query.targetType === "string" ? req.query.targetType : undefined;
    const result = await adminService.getReports({ page, limit, status, targetType });
    sendResponse(res, 200, true, "Reports fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const updated = await adminService.updateReport(req.params.id as string, adminId, req.body);
    sendResponse(res, 200, true, "Report updated successfully", updated);
  } catch (error) {
    next(error);
  }
};


export const getModeration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const targetType = typeof req.query.targetType === "string" ? req.query.targetType : undefined;
    const result = await adminService.getModerationQueue({ page, limit, status, targetType });
    sendResponse(res, 200, true, "Moderation queue fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const approveModeration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const updated = await adminService.approveModeration(req.params.id as string, adminId);
    sendResponse(res, 200, true, "Item approved successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const rejectModeration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const updated = await adminService.rejectModeration(req.params.id as string, adminId);
    sendResponse(res, 200, true, "Item rejected successfully", updated);
  } catch (error) {
    next(error);
  }
};


export const getAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await adminService.getAnalytics();
    sendResponse(res, 200, true, "Analytics fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const reactivateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await adminService.reactivateUser(req.params.id as string);
    sendResponse(res, 200, true, "User reactivated successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await adminService.getUserById(req.params.id as string);
    sendResponse(res, 200, true, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const getCaseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const caseRecord = await adminService.getCaseById(req.params.id as string);
    sendResponse(res, 200, true, "Case fetched successfully", caseRecord);
  } catch (error) {
    next(error);
  }
};