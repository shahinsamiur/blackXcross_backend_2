import { Request, Response, NextFunction } from "express";
import * as notificationService from "./notificationService.js";
import sendResponse from "../../shared/utils/response.js";

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);
    const isRead = req.query.isRead === "true" ? true : req.query.isRead === "false" ? false : undefined;

    const result = await notificationService.getNotifications(userId, { page, limit, isRead });
    sendResponse(res, 200, true, "Notifications fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await notificationService.markAsRead(req.params.id as string, userId);
    sendResponse(res, 200, true, "Notification marked as read", null);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await notificationService.markAllAsRead(userId);
    sendResponse(res, 200, true, "All notifications marked as read", null);
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await notificationService.deleteNotification(req.params.id as string, userId);
    sendResponse(res, 200, true, "Notification deleted successfully", null);
  } catch (error) {
    next(error);
  }
};