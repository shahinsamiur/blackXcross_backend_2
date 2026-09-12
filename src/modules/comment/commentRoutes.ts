import { Router } from "express";
import * as commentController from "./commentController.js";
import validate from "../../shared/middleware/validate.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import optionalAuthMiddleware from "../../shared/middleware/optionalAuthMiddleware.js";
import { createCommentSchema, updateCommentSchema } from "./commentValidators.js";

const router = Router();

/**
 * @openapi
 * /api/theories/{theoryId}/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a new comment on a theory
 *     parameters:
 *       - in: path
 *         name: theoryId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201: { description: Comment created successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post("/theories/:theoryId/comments", authMiddleware, validate(createCommentSchema), commentController.createComment);

/**
 * @openapi
 * /api/theories/{theoryId}/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get paginated comments for a theory
 *     parameters:
 *       - in: path
 *         name: theoryId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated list of comments }
 */
router.get("/theories/:theoryId/comments", optionalAuthMiddleware, commentController.getComments);

/**
 * @openapi
 * /api/comments/{id}/replies:
 *   post:
 *     tags: [Comments]
 *     summary: Reply to an existing comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201: { description: Reply created successfully }
 *       404: { description: Parent comment not found }
 */
router.post("/comments/:id/replies", authMiddleware, validate(createCommentSchema), commentController.createReply);

/**
 * @openapi
 * /api/comments/{id}:
 *   patch:
 *     tags: [Comments]
 *     summary: Update a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       200: { description: Comment updated successfully }
 *       403: { description: Not the comment owner }
 *       404: { description: Comment not found }
 */
router.patch("/comments/:id", authMiddleware, validate(updateCommentSchema), commentController.updateComment);

/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Comment deleted successfully }
 *       403: { description: Not the comment owner }
 *       404: { description: Comment not found }
 */
router.delete("/comments/:id", authMiddleware, commentController.deleteComment);

export default router;