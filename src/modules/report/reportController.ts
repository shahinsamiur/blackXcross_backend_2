import { Request, Response, NextFunction } from "express";
import {
  ReportStatus,
  ReportTargetType,
} from "../../../generated/prisma/client.js";
import * as reportService from "./reportService.js";
import sendResponse from "../../shared/utils/response.js";

export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reporterId = (req as any).user.id;
    const created = await reportService.createReport(reporterId, req.body);
    sendResponse(res, 201, true, "Report submitted successfully", created);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1),
      50,
    );
    const status =
      typeof req.query.status === "string"
        ? (req.query.status as ReportStatus)
        : undefined;

    const targetType =
      typeof req.query.targetType === "string"
        ? (req.query.targetType as ReportTargetType)
        : undefined;

    const result = await reportService.getReports(requester?.role, {
      page,
      limit,
      status,
      targetType,
    });
    sendResponse(res, 200, true, "Reports fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const report = await reportService.getReportById(
      req.params.id as string,
      requester?.role,
    );
    sendResponse(res, 200, true, "Report fetched successfully", report);
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const updated = await reportService.updateReport(
      req.params.id as string,
      requester.id,
      requester.role,
      req.body,
    );
    sendResponse(res, 200, true, "Report updated successfully", updated);
  } catch (error) {
    next(error);
  }
};
