import { Router } from "express";
import * as reportController from "./reportController.js";
import validate from "../../shared/middleware/validate.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import { createReportSchema, updateReportSchema } from "./reportValidators.js";

const router = Router();

/**
 * @openapi
 * /api/reports:
 *   post:
 *     tags: [Reports]
 *     summary: Submit a new report (Any authenticated user)
 */
router.post("/", authMiddleware, validate(createReportSchema), reportController.createReport);

/**
 * @openapi
 * /api/reports:
 *   get:
 *     tags: [Reports]
 *     summary: Get all reports (Admin only)
 */
router.get("/", authMiddleware, reportController.getReports);

/**
 * @openapi
 * /api/reports/{id}:
 *   get:
 *     tags: [Reports]
 *     summary: Get a specific report (Admin only)
 */
router.get("/:id", authMiddleware, reportController.getReport);

/**
 * @openapi
 * /api/reports/{id}:
 *   patch:
 *     tags: [Reports]
 *     summary: Update a report status/notes (Admin only)
 */
router.patch("/:id", authMiddleware, validate(updateReportSchema), reportController.updateReport);

export default router;