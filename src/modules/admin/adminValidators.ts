import * as yup from "yup";
import { ReportStatus, ReportTargetType } from "../../../generated/prisma/client.js";

export const updateReportSchema = yup.object({
  status: yup.mixed<ReportStatus>().oneOf(Object.values(ReportStatus), "Invalid status"),
  adminNotes: yup.string().trim().max(2000, "Admin notes are too long"),
});

export const adminUserQuerySchema = yup.object({
  search: yup.string(),
  role: yup.string(),
  status: yup.string(),
  page: yup.number().integer().min(1),
  limit: yup.number().integer().min(1).max(50),
});

export const adminCaseQuerySchema = yup.object({
  search: yup.string(),
  publishState: yup.string(),
  category: yup.string(),
  page: yup.number().integer().min(1),
  limit: yup.number().integer().min(1).max(50),
});