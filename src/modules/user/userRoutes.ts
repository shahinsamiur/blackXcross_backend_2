import { Router } from "express";

import * as userController from "./userController.js";
import validate from "../../shared/middleware/validate.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import { updateUserSchema } from "./userValidators.js";

const router = Router();

/**
 * @openapi
 * /api/users/search:
 *   get:
 *     tags:
 *       - Users
 *     summary: Search users
 *     description: Searches users by name or username.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Matching users
 *       400:
 *         description: Missing search query
 */
router.get("/search", userController.searchUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user's public profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 */
router.get("/:id", userController.getUser);

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a user's profile
 *     description: Only the profile owner can update their own profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Updated profile
 *       403:
 *         description: Not allowed to update another user's profile
 *       404:
 *         description: User not found
 *       409:
 *         description: Username already taken
 */
router.patch("/:id", authMiddleware, validate(updateUserSchema), userController.updateUser);

/**
 * @openapi
 * /api/users/{id}/cases:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get cases submitted by a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of cases
 *       404:
 *         description: User not found
 */
router.get("/:id/cases", userController.getUserCases);

/**
 * @openapi
 * /api/users/{id}/theories:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get theories published by a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of theories
 *       404:
 *         description: User not found
 */
router.get("/:id/theories", userController.getUserTheories);

/**
 * @openapi
 * /api/users/{id}/follow:
 *   post:
 *     tags:
 *       - Users
 *     summary: Follow a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: User followed
 *       400:
 *         description: Cannot follow yourself
 *       404:
 *         description: User not found
 *       409:
 *         description: Already following this user
 */
router.post("/:id/follow", authMiddleware, userController.followUser);

/**
 * @openapi
 * /api/users/{id}/follow:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Unfollow a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unfollowed
 *       404:
 *         description: Not following this user
 */
router.delete("/:id/follow", authMiddleware, userController.unfollowUser);

/**
 * @openapi
 * /api/users/{id}/followers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user's followers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followers
 *       404:
 *         description: User not found
 */
router.get("/:id/followers", userController.getFollowers);

/**
 * @openapi
 * /api/users/{id}/following:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users this user is following
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followed users
 *       404:
 *         description: User not found
 */
router.get("/:id/following", userController.getFollowing);

export default router;