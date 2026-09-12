import AppError from "../../shared/utils/AppError.js";
import { Role, ReportStatus, ReportTargetType, Prisma } from "../../../generated/prisma/client.js";
import * as reportRepository from "./reportRepository.js";
import { CreateReportInput, UpdateReportInput, ReportSearchQuery } from "./reportTypes.js";

const assertAdmin = (requesterRole?: Role) => {
  if (requesterRole !== Role.ADMIN) {
    throw new AppError("Forbidden: Admin access required", 403);
  }
};

export const createReport = async (reporterId: string, data: CreateReportInput) => {
  return reportRepository.createReport({ ...data, reporterId });
};

export const getReports = async (requesterRole: Role | undefined, query: ReportSearchQuery) => {
  assertAdmin(requesterRole);

  const where: Prisma.ReportWhereInput = {};
  if (query.status) where.status = query.status as ReportStatus;
  if (query.targetType) where.targetType = query.targetType as ReportTargetType;

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    reportRepository.findReports(where, skip, query.limit),
    reportRepository.countReports(where),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getReportById = async (id: string, requesterRole: Role | undefined) => {
  assertAdmin(requesterRole);
  
  const report = await reportRepository.findReportById(id);
  if (!report) throw new AppError("Report not found", 404);
  
  return report;
};

export const updateReport = async (id: string, requesterId: string, requesterRole: Role | undefined, data: UpdateReportInput) => {
  assertAdmin(requesterRole);

  const report = await reportRepository.findReportById(id);
  if (!report) throw new AppError("Report not found", 404);

  const updateData: any = {};
  if (data.status) updateData.status = data.status;
  if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;
  
  // Automatically track who resolved/dismissed the report
  if (data.status && (data.status === ReportStatus.RESOLVED || data.status === ReportStatus.DISMISSED)) {
    updateData.resolvedBy = requesterId;
  }

  return reportRepository.updateReport(id, updateData);
};