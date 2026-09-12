import { Router } from "express";
import * as theoryController from "./theoryController.js";
import validate from "../../shared/middleware/validate.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import optionalAuthMiddleware from "../../shared/middleware/optionalAuthMiddleware.js";
import { createTheorySchema, updateTheorySchema } from "./theoryValidators.js";

const router = Router();

/**
 * @openapi
 * /api/cases/{caseId}/theories:
 *   post:
 *     tags: [Theories]
 *     summary: Create a new theory for a case
 */
router.post("/cases/:caseId/theories", authMiddleware, validate(createTheorySchema), theoryController.createTheory);

/**
 * @openapi
 * /api/cases/{caseId}/theories:
 *   get:
 *     tags: [Theories]
 *     summary: Get theories for a case
 */
router.get("/cases/:caseId/theories", optionalAuthMiddleware, theoryController.getTheoriesByCase);

/**
 * @openapi
 * /api/theories/{id}:
 *   get:
 *     tags: [Theories]
 *     summary: Get a single theory
 */
router.get("/theories/:id", optionalAuthMiddleware, theoryController.getTheory);

/**
 * @openapi
 * /api/theories/{id}:
 *   patch:
 *     tags: [Theories]
 *     summary: Update a theory
 */
router.patch("/theories/:id", authMiddleware, validate(updateTheorySchema), theoryController.updateTheory);

/**
 * @openapi
 * /api/theories/{id}:
 *   delete:
 *     tags: [Theories]
 *     summary: Delete a theory
 */
router.delete("/theories/:id", authMiddleware, theoryController.deleteTheory);

/**
 * @openapi
 * /api/theories/{id}/upvote:
 *   post:
 *     tags: [Theories]
 *     summary: Upvote a theory
 */
router.post("/theories/:id/upvote", authMiddleware, theoryController.upvoteTheory);

/**
 * @openapi
 * /api/theories/{id}/upvote:
 *   delete:
 *     tags: [Theories]
 *     summary: Remove upvote from a theory
 */
router.delete("/theories/:id/upvote", authMiddleware, theoryController.removeUpvote);

export default router;