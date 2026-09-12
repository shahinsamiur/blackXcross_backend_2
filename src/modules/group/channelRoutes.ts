import { Router } from "express";

import * as groupController from "./groupController.js";
import validate from "../../shared/middleware/validate.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import { updateChannelSchema } from "./groupValidators.js";

const router = Router();

/**
 * @openapi
 * /api/channels/{id}:
 *   patch:
 *     tags: [Groups]
 *     summary: Update a channel (owner/admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateChannelRequest'
 *     responses:
 *       200:
 *         description: Channel updated
 *       404:
 *         description: Channel not found
 */
router.patch("/:id", authMiddleware, validate(updateChannelSchema), groupController.updateChannel);

/**
 * @openapi
 * /api/channels/{id}:
 *   delete:
 *     tags: [Groups]
 *     summary: Delete a channel (owner/admin only)
 *     responses:
 *       200:
 *         description: Channel deleted
 *       404:
 *         description: Channel not found
 */
router.delete("/:id", authMiddleware, groupController.deleteChannel);

export default router;