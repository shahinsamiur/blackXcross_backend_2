import { Router } from "express";

import * as groupController from "./groupController.js";
import validate from "../../shared/middleware/validate.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import optionalAuthMiddleware from "../../shared/middleware/optionalAuthMiddleware.js";
import {
  createGroupSchema,
  updateGroupSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
  createChannelSchema,
} from "./groupValidators.js";

const router = Router();

/**
 * @openapi
 * /api/groups:
 *   post:
 *     tags: [Groups]
 *     summary: Create a group (creator becomes owner)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupRequest'
 *     responses:
 *       201:
 *         description: Group created
 */
router.post("/", authMiddleware, validate(createGroupSchema), groupController.createGroup);

/**
 * @openapi
 * /api/groups:
 *   get:
 *     tags: [Groups]
 *     summary: Browse/search groups
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of groups
 */
router.get("/", optionalAuthMiddleware, groupController.listGroups);

/**
 * @openapi
 * /api/groups/{id}:
 *   get:
 *     tags: [Groups]
 *     summary: Get a group
 *     description: Private groups are only visible to members.
 *     responses:
 *       200:
 *         description: Group detail
 *       404:
 *         description: Group not found
 */
router.get("/:id", optionalAuthMiddleware, groupController.getGroup);

/**
 * @openapi
 * /api/groups/{id}:
 *   patch:
 *     tags: [Groups]
 *     summary: Update a group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGroupRequest'
 *     responses:
 *       200:
 *         description: Group updated
 *       403:
 *         description: Not the owner/admin of this group
 */
router.patch("/:id", authMiddleware, validate(updateGroupSchema), groupController.updateGroup);

/**
 * @openapi
 * /api/groups/{id}:
 *   delete:
 *     tags: [Groups]
 *     summary: Delete a group
 *     responses:
 *       200:
 *         description: Group deleted
 *       403:
 *         description: Only the owner can delete the group
 */
router.delete("/:id", authMiddleware, groupController.deleteGroup);

/**
 * @openapi
 * /api/groups/{id}/invite:
 *   post:
 *     tags: [Groups]
 *     summary: Add a user directly to the group (owner/admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InviteMemberRequest'
 *     responses:
 *       201:
 *         description: User added
 *       409:
 *         description: Already a member
 */
router.post("/:id/invite", authMiddleware, validate(inviteMemberSchema), groupController.inviteMember);

/**
 * @openapi
 * /api/groups/{id}/join:
 *   post:
 *     tags: [Groups]
 *     summary: Join a public group
 *     responses:
 *       201:
 *         description: Joined
 *       403:
 *         description: Group is private
 *       409:
 *         description: Already a member
 */
router.post("/:id/join", authMiddleware, groupController.joinGroup);

/**
 * @openapi
 * /api/groups/{id}/leave:
 *   delete:
 *     tags: [Groups]
 *     summary: Leave a group
 *     responses:
 *       200:
 *         description: Left the group
 *       400:
 *         description: The owner cannot leave
 *       404:
 *         description: Not a member
 */
router.delete("/:id/leave", authMiddleware, groupController.leaveGroup);

/**
 * @openapi
 * /api/groups/{id}/members:
 *   get:
 *     tags: [Groups]
 *     summary: List group members
 *     responses:
 *       200:
 *         description: List of members
 *       404:
 *         description: Group not found
 */
router.get("/:id/members", optionalAuthMiddleware, groupController.getMembers);

/**
 * @openapi
 * /api/groups/{id}/members/{memberId}:
 *   patch:
 *     tags: [Groups]
 *     summary: Change a member's role (owner only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMemberRoleRequest'
 *     responses:
 *       200:
 *         description: Role updated
 *       403:
 *         description: Only the owner can change roles
 */
router.patch(
  "/:id/members/:memberId",
  authMiddleware,
  validate(updateMemberRoleSchema),
  groupController.updateMemberRole,
);

/**
 * @openapi
 * /api/groups/{id}/members/{memberId}:
 *   delete:
 *     tags: [Groups]
 *     summary: Remove a member (owner/admin only)
 *     responses:
 *       200:
 *         description: Member removed
 *       400:
 *         description: Cannot remove the owner
 */
router.delete("/:id/members/:memberId", authMiddleware, groupController.removeMember);

/**
 * @openapi
 * /api/groups/{id}/channels:
 *   post:
 *     tags: [Groups]
 *     summary: Create a channel (owner/admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChannelRequest'
 *     responses:
 *       201:
 *         description: Channel created
 */
router.post("/:id/channels", authMiddleware, validate(createChannelSchema), groupController.createChannel);

/**
 * @openapi
 * /api/groups/{id}/channels:
 *   get:
 *     tags: [Groups]
 *     summary: List a group's channels (members only)
 *     responses:
 *       200:
 *         description: List of channels
 *       403:
 *         description: Must be a member
 */
router.get("/:id/channels", authMiddleware, groupController.getChannels);

export default router;