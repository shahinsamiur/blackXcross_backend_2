import AppError from "../../shared/utils/AppError.js";
import * as notificationRepository from "./notificationRepository.js";
import { NotificationSearchQuery } from "./notificationTypes.js";
import { Prisma } from "../../../generated/prisma/client.js";

export const getNotifications = async (userId: string, query: NotificationSearchQuery) => {
  const where: Prisma.NotificationWhereInput = {};
  if (query.isRead !== undefined) {
    where.isRead = query.isRead;
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    notificationRepository.findNotificationsByUserId(userId, where, skip, query.limit),
    notificationRepository.countNotificationsByUserId(userId, where),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const markAsRead = async (id: string, userId: string) => {
  const notification = await notificationRepository.findNotificationById(id);
  if (!notification) throw new AppError("Notification not found", 404);
  if (notification.userId !== userId) throw new AppError("Forbidden", 403);
  
  return notificationRepository.markAsRead(id);
};

export const markAllAsRead = async (userId: string) => {
  return notificationRepository.markAllAsRead(userId);
};

export const deleteNotification = async (id: string, userId: string) => {
  const notification = await notificationRepository.findNotificationById(id);
  if (!notification) throw new AppError("Notification not found", 404);
  if (notification.userId !== userId) throw new AppError("Forbidden", 403);
  
  await notificationRepository.deleteNotification(id);
};