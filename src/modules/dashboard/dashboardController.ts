import { Request, Response, NextFunction } from "express";
import * as dashboardService from "./dashboardService.js";
import sendResponse from "../../shared/utils/response.js";

export const getDashboardData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await dashboardService.getDashboard();
    sendResponse(res, 200, true, "Dashboard data fetched successfully", data);
  } catch (error) {
    next(error);
  }
};