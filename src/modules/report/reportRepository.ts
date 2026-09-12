import { prisma } from "../../lib/prisma.js";
import { Prisma, ReportTargetType, ReportStatus } from "../../../generated/prisma/client.js";

const reportInclude = {
  reporter: { select: { id: true, name: true, username: true, avatar: true } },
};

export const createReport = (data: { reporterId: string; targetType: ReportTargetType; targetId: string; reason: string }) =>
  prisma.report.create({ data, include: reportInclude });

export const findReports = (where: Prisma.ReportWhereInput, skip: number, take: number) =>
  prisma.report.findMany({
    where,
    include: reportInclude,
    orderBy: { createdAt: "desc" as const },
    skip,
    take,
  });

export const countReports = (where: Prisma.ReportWhereInput) =>
  prisma.report.count({ where });

export const findReportById = (id: string) =>
  prisma.report.findUnique({ where: { id }, include: reportInclude });

export const updateReport = (id: string, data: { status?: ReportStatus; adminNotes?: string; resolvedBy?: string }) =>
  prisma.report.update({ where: { id }, data, include: reportInclude });