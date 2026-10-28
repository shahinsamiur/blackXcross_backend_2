import { Router } from "express";
import * as moderationController from "./moderationController.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import adminMiddleware from "../admin/adminMiddleware.js";
import validate from "../../shared/middleware/validate.js";
import { checkCaseSchema, checkImageSchema } from "./moderationValidators.js";

const router = Router();

/**
 * @openapi
 * /api/moderation/check-case:
 *   post:
 *     tags: [Moderation]
 *     summary: Submit a case for AI moderation check
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [caseId]
 *             properties:
 *               caseId: { type: string, format: uuid }
 *     responses:
 *       200: { description: Moderation check completed }
 *       404: { description: Case not found }
 */
router.post("/check-case", authMiddleware, validate(checkCaseSchema), moderationController.checkCase);

/**
 * @openapi
 * /api/moderation/check-image:
 *   post:
 *     tags: [Moderation]
 *     summary: Submit an image for AI moderation check
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fileUrl, targetType, targetId]
 *             properties:
 *               fileUrl: { type: string, format: uri }
 *               targetType: { type: string, enum: [CASE, THEORY, COMMENT] }
 *               targetId: { type: string, format: uuid }
 *     responses:
 *       200: { description: Image moderation check completed }
 */
router.post("/check-image", authMiddleware, validate(checkImageSchema), moderationController.checkImage);

router.use("/queue", authMiddleware, adminMiddleware);
router.use("/:id", authMiddleware, adminMiddleware);

/**
 * @openapi
 * /api/moderation/queue:
 *   get:
 *     tags: [Moderation]
 *     summary: Get moderation queue (Admin only)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, APPROVED, REJECTED] }
 *       - in: query
 *         name: targetType
 *         schema: { type: string, enum: [CASE, THEORY, COMMENT] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated moderation queue }
 *       403: { description: Forbidden }
 */
router.get("/queue", moderationController.getModerationQueue);

/**
 * @openapi
 * /api/moderation/{id}:
 *   get:
 *     tags: [Moderation]
 *     summary: Get a specific moderation item (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Moderation item details }
 *       404: { description: Item not found }
 */
router.get("/:id", moderationController.getModerationItem);

/**
 * @openapi
 * /api/moderation/{id}/approve:
 *   post:
 *     tags: [Moderation]
 *     summary: Approve a moderation item (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Item approved }
 *       400: { description: Already reviewed }
 *       404: { description: Item not found }
 */
router.post("/:id/approve", moderationController.approveModeration);

/**
 * @openapi
 * /api/moderation/{id}/reject:
 *   post:
 *     tags: [Moderation]
 *     summary: Reject a moderation item (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Item rejected }
 *       400: { description: Already reviewed }
 *       404: { description: Item not found }
 */
router.post("/:id/reject", moderationController.rejectModeration);

export default router;