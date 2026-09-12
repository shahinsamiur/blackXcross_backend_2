import * as yup from "yup";
import { CaseCategory, InvestigationStatus } from "../../../generated/prisma/client.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateCaseRequest:
 *       type: object
 *       required:
 *         - title
 *         - category
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           enum: [COLD_CASE, MISSING_PERSON, UNSOLVED_MURDER, UNIDENTIFIED_REMAINS, OTHER]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     UpdateCaseRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           enum: [COLD_CASE, MISSING_PERSON, UNSOLVED_MURDER, UNIDENTIFIED_REMAINS, OTHER]
 *         investigationStatus:
 *           type: string
 *           enum: [OPEN, CLOSED, COLD, SOLVED]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */
export const createCaseSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().max(5000, "Description is too long"),
  category: yup
    .mixed<CaseCategory>()
    .oneOf(Object.values(CaseCategory), "Invalid category")
    .required("Category is required"),
  tags: yup.array().of(yup.string().required()).max(10, "At most 10 tags allowed"),
});

export const updateCaseSchema = yup.object({
  title: yup.string(),
  description: yup.string().max(5000, "Description is too long"),
  category: yup.mixed<CaseCategory>().oneOf(Object.values(CaseCategory), "Invalid category"),
  investigationStatus: yup
    .mixed<InvestigationStatus>()
    .oneOf(Object.values(InvestigationStatus), "Invalid investigation status"),
  tags: yup.array().of(yup.string().required()).max(10, "At most 10 tags allowed"),
});