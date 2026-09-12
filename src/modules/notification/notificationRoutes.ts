import { Router } from "express";
import * as notificationController from "./notificationController.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";

const router = Router();

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get current user's notifications
 */
router.get("/", authMiddleware, notificationController.getNotifications);

/**
 * @openapi
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 */
router.patch("/:id/read", authMiddleware, notificationController.markAsRead);

/**
 * @openapi
 * /api/notifications/read-all:
 *   post:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 */
router.post("/read-all", authMiddleware, notificationController.markAllAsRead);

/**
 * @openapi
 * /api/notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 */
router.delete("/:id", authMiddleware, notificationController.deleteNotification);

export default router;