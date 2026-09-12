import * as yup from "yup";
import { ModerationTargetType } from "../../../generated/prisma/client.js";

export const checkCaseSchema = yup.object({
  caseId: yup.string().uuid("Invalid case ID").required("Case ID is required"),
});

export const checkImageSchema = yup.object({
  fileUrl: yup.string().url("Invalid file URL").required("File URL is required"),
  targetType: yup.mixed<ModerationTargetType>().oneOf(Object.values(ModerationTargetType), "Invalid target type").required("Target type is required"),
  targetId: yup.string().uuid("Invalid target ID").required("Target ID is required"),
});