import { prisma } from "../../lib/prisma.js";
import { Prisma, NotificationType } from "../../../generated/prisma/client.js";

const notificationInclude = {
  actor: { select: { id: true, name: true, username: true, avatar: true } },
};

export const findNotificationsByUserId = (userId: string, where: Prisma.NotificationWhereInput, skip: number, take: number) =>
  prisma.notification.findMany({
    where: { userId, ...where },
    include: notificationInclude,
    orderBy: { createdAt: "desc" as const },
    skip,
    take,
  });

export const countNotificationsByUserId = (userId: string, where: Prisma.NotificationWhereInput) =>
  prisma.notification.count({ where: { userId, ...where } });

export const findNotificationById = (id: string) =>
  prisma.notification.findUnique({ where: { id } });

export const markAsRead = (id: string) =>
  prisma.notification.update({ where: { id }, data: { isRead: true } });

export const markAllAsRead = (userId: string) =>
  prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });

export const deleteNotification = (id: string) =>
  prisma.notification.delete({ where: { id } });

export const createNotification = (data: {
  userId: string;
  actorId?: string;
  type: NotificationType;
  title: string;
  message?: string;
  referenceId?: string;
  referenceType?: string;
}) => prisma.notification.create({ data });