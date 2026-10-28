import { Router } from "express";
import * as dashboardController from "./dashboardController.js";
import optionalAuthMiddleware from "../../shared/middleware/optionalAuthMiddleware.js";
const router = Router();
/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard home page data (recent cases, trending theories, activity, stats)
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 */
router.get("/", optionalAuthMiddleware, dashboardController.getDashboardData);
export default router;