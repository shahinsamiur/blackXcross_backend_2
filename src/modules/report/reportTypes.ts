import { ReportTargetType, ReportStatus } from "../../../generated/prisma/client.js";

export interface CreateReportInput {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}

export interface UpdateReportInput {
  status?: ReportStatus;
  adminNotes?: string;
}

export interface ReportSearchQuery {
  page: number;
  limit: number;
  status?: ReportStatus;
  targetType?: ReportTargetType;
}