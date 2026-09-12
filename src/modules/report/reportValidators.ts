import * as yup from "yup";
import { ReportTargetType, ReportStatus } from "../../../generated/prisma/client.js";

export const createReportSchema = yup.object({
  targetType: yup.mixed<ReportTargetType>().oneOf(Object.values(ReportTargetType), "Invalid target type").required("Target type is required"),
  targetId: yup.string().uuid("Invalid target ID").required("Target ID is required"),
  reason: yup.string().trim().required("Reason is required").max(1000, "Reason is too long"),
});

export const updateReportSchema = yup.object({
  status: yup.mixed<ReportStatus>().oneOf(Object.values(ReportStatus), "Invalid status"),
  adminNotes: yup.string().trim().max(2000, "Admin notes are too long"),
});