import { Router } from "express";

import * as caseController from "./caseController.js";
import validate from "../../shared/middleware/validate.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import optionalAuthMiddleware from "../../shared/middleware/optionalAuthMiddleware.js";
import upload from "../../shared/utils/upload.js"; 
import { createCaseSchema, updateCaseSchema } from "./caseValidators.js";

const router = Router();

/**
 * @openapi
 * /api/cases:
 *   post:
 *     tags: [Cases]
 *     summary: Create a new case (starts as draft)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCaseRequest'
 *     responses:
 *       201:
 *         description: Case created
 *       400:
 *         description: Validation error
 */
router.post("/", authMiddleware, validate(createCaseSchema), caseController.createCase);

/**
 * @openapi
 * /api/cases:
 *   get:
 *     tags: [Cases]
 *     summary: Browse/search published cases
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [COLD_CASE, MISSING_PERSON, UNSOLVED_MURDER, UNIDENTIFIED_REMAINS, OTHER] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [OPEN, CLOSED, COLD, SOLVED] }
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [newest, oldest] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of published cases
 */
router.get("/", optionalAuthMiddleware, caseController.listCases);

/**
 * @openapi
 * /api/cases/{id}:
 *   get:
 *     tags: [Cases]
 *     summary: Get a single case
 *     description: Draft cases are only visible to the owner or an admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Case detail
 *       404:
 *         description: Case not found
 */
router.get("/:id", optionalAuthMiddleware, caseController.getCase);

/**
 * @openapi
 * /api/cases/{id}:
 *   patch:
 *     tags: [Cases]
 *     summary: Update a case
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCaseRequest'
 *     responses:
 *       200:
 *         description: Case updated
 *       403:
 *         description: Not the case owner
 *       404:
 *         description: Case not found
 */
router.patch("/:id", authMiddleware, validate(updateCaseSchema), caseController.updateCase);

/**
 * @openapi
 * /api/cases/{id}:
 *   delete:
 *     tags: [Cases]
 *     summary: Delete a case
 *     responses:
 *       200:
 *         description: Case deleted
 *       403:
 *         description: Not the case owner
 *       404:
 *         description: Case not found
 */
router.delete("/:id", authMiddleware, caseController.deleteCase);

/**
 * @openapi
 * /api/cases/{id}/publish:
 *   post:
 *     tags: [Cases]
 *     summary: Publish a draft case
 *     responses:
 *       200:
 *         description: Case published
 */
router.post("/:id/publish", authMiddleware, caseController.publishCase);

/**
 * @openapi
 * /api/cases/{id}/draft:
 *   post:
 *     tags: [Cases]
 *     summary: Move a published case back to draft
 *     responses:
 *       200:
 *         description: Case moved to draft
 */
router.post("/:id/draft", authMiddleware, caseController.draftCase);

/**
 * @openapi
 * /api/cases/{id}/files:
 *   get:
 *     tags: [Cases]
 *     summary: List files/evidence attached to a case
 *     responses:
 *       200:
 *         description: List of files
 */
router.get("/:id/files", optionalAuthMiddleware, caseController.getCaseFiles);

/**
 * @openapi
 * /api/cases/{id}/files:
 *   post:
 *     tags: [Cases]
 *     summary: Upload a file/evidence to a case
 *     responses:
 *       201:
 *         description: File uploaded
 *       400:
 *         description: No file uploaded
 */
router.post("/:id/files", authMiddleware, upload.single("file"), caseController.addCaseFile);

/**
 * @openapi
 * /api/cases/{id}/files/{fileId}:
 *   delete:
 *     tags: [Cases]
 *     summary: Delete a file from a case
 *     responses:
 *       200:
 *         description: File deleted
 *       404:
 *         description: File not found
 */
router.delete("/:id/files/:fileId", authMiddleware, caseController.removeCaseFile);

/**
 * @openapi
 * /api/cases/{id}/theories:
 *   get:
 *     tags: [Cases]
 *     summary: Get theories published about a case
 *     responses:
 *       200:
 *         description: List of theories
 */
router.get("/:id/theories", optionalAuthMiddleware, caseController.getCaseTheories);

export default router;