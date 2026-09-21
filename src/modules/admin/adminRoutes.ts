import { Router } from "express";
import * as adminController from "./adminController.js";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import adminMiddleware from "./adminMiddleware.js";
import validate from "../../shared/middleware/validate.js";
import { updateReportSchema } from "./adminValidators.js";

const router = Router();

// All admin routes require authentication + admin role
router.use(authMiddleware, adminMiddleware);

/**
 * @openapi
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard overview
 *     responses:
 *       200: { description: Dashboard data }
 *       403: { description: Forbidden }
 */
router.get("/dashboard", adminController.getDashboard);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users with filtering
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, SUSPENDED, BANNED] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated user list }
 */
router.get("/users", adminController.getUsers);

/**
 * @openapi
 * /api/admin/users/{id}/suspend:
 *   patch:
 *     tags: [Admin]
 *     summary: Suspend a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User suspended }
 *       403: { description: Cannot suspend admin }
 *       404: { description: User not found }
 */
router.patch("/users/:id/suspend", adminController.suspendUser);

/**
 * @openapi
 * /api/admin/users/{id}/ban:
 *   patch:
 *     tags: [Admin]
 *     summary: Ban a user permanently
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User banned }
 *       403: { description: Cannot ban admin }
 *       404: { description: User not found }
 */
router.patch("/users/:id/ban", adminController.banUser);

/**
 * @openapi
 * /api/admin/cases:
 *   get:
 *     tags: [Admin]
 *     summary: List all cases including drafts
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: publishState
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated case list }
 */
router.get("/cases", adminController.getCases);

/**
 * @openapi
 * /api/admin/cases/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete any case
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Case deleted }
 *       404: { description: Case not found }
 */
router.delete("/cases/:id", adminController.deleteCase);

/**
 * @openapi
 * /api/admin/reports:
 *   get:
 *     tags: [Admin]
 *     summary: List all reports
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: targetType
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated report list }
 */
router.get("/reports", adminController.getReports);

/**
 * @openapi
 * /api/admin/reports/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a report status/notes
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
 *             properties:
 *               status: { type: string, enum: [PENDING, REVIEWED, RESOLVED, DISMISSED] }
 *               adminNotes: { type: string }
 *     responses:
 *       200: { description: Report updated }
 *       404: { description: Report not found }
 */
router.patch("/reports/:id", validate(updateReportSchema), adminController.updateReport);



/**
 * @openapi
 * /api/admin/analytics:
 *   get:
 *     tags: [Admin]
 *     summary: Get detailed platform analytics
 *     responses:
 *       200: { description: Analytics data }
 */
router.get("/analytics", adminController.getAnalytics);


/**
 * @openapi
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a single user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User detail }
 *       404: { description: User not found }
 */
router.get("/users/:id", adminController.getUserById);



/**
 * @openapi
 * /api/admin/users/{id}/reactivate:
 *   patch:
 *     tags: [Admin]
 *     summary: Reactivate a suspended or banned user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User reactivated }
 *       400: { description: User is already active }
 *       404: { description: User not found }
 */
router.patch("/users/:id/reactivate", adminController.reactivateUser);

/**
 * @openapi
 * /api/admin/cases/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a single case by id (admin, includes drafts)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Case detail }
 *       404: { description: Case not found }
 */
router.get("/cases/:id", adminController.getCaseById);
export default router;