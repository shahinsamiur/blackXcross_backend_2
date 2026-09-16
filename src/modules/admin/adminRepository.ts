import { prisma } from "../../lib/prisma.js";
import {
  Prisma,
  UserStatus,
  Role,
  PublishState,
  CaseCategory,
  ReportStatus,
  ReportTargetType,
  ModerationStatus,
  ModerationTargetType,
} from "../../../generated/prisma/client.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
  bio: true,
  avatar: true,
  role: true,
  status: true,
  isEmailVerified: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: { cases: true, reports: true },
  },
};

export const findUsers = (
  where: Prisma.UserWhereInput,
  skip: number,
  take: number,
) =>
  prisma.user.findMany({
    where,
    select: userSelect,
    orderBy: { createdAt: "desc" as const },
    skip,
    take,
  });

export const countUsers = (where: Prisma.UserWhereInput) =>
  prisma.user.count({ where });

export const findUserById = (id: string) =>
  prisma.user.findUnique({ where: { id }, select: userSelect });

export const updateUserStatus = (id: string, status: UserStatus) =>
  prisma.user.update({ where: { id }, data: { status }, select: userSelect });

const caseInclude = {
  tags: true,
  user: { select: { id: true, name: true, username: true, avatar: true } },
  _count: { select: { theories: true, files: true } },
};

export const findCases = (
  where: Prisma.CaseWhereInput,
  skip: number,
  take: number,
) =>
  prisma.case.findMany({
    where,
    include: caseInclude,
    orderBy: { createdAt: "desc" as const },
    skip,
    take,
  });

export const countCases = (where: Prisma.CaseWhereInput) =>
  prisma.case.count({ where });

export const deleteCase = (id: string) => prisma.case.delete({ where: { id } });

export const findCaseById = (id: string) =>
  prisma.case.findUnique({ where: { id } });

const reportInclude = {
  reporter: { select: { id: true, name: true, username: true, avatar: true } },
};

export const findReports = (
  where: Prisma.ReportWhereInput,
  skip: number,
  take: number,
) =>
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

export const updateReport = (
  id: string,
  data: { status?: ReportStatus; adminNotes?: string; resolvedBy?: string },
) => prisma.report.update({ where: { id }, data, include: reportInclude });

const moderationInclude = {
  reviewer: { select: { id: true, name: true, username: true } },
};

export const findModerationItems = (
  where: Prisma.ModerationItemWhereInput,
  skip: number,
  take: number,
) =>
  prisma.moderationItem.findMany({
    where,
    include: moderationInclude,
    orderBy: { createdAt: "desc" as const },
    skip,
    take,
  });

export const countModerationItems = (where: Prisma.ModerationItemWhereInput) =>
  prisma.moderationItem.count({ where });

export const findModerationItemById = (id: string) =>
  prisma.moderationItem.findUnique({
    where: { id },
    include: moderationInclude,
  });

export const updateModerationItem = (
  id: string,
  data: { status: ModerationStatus; reviewedBy: string },
) =>
  prisma.moderationItem.update({
    where: { id },
    data,
    include: moderationInclude,
  });

export const getTotalCounts = async () => {
  const [users, cases, theories, comments, reports, moderation] =
    await Promise.all([
      prisma.user.count(),
      prisma.case.count(),
      prisma.theory.count(),
      prisma.comment.count(),
      prisma.report.count({ where: { status: ReportStatus.PENDING } }),
      prisma.moderationItem.count({
        where: { status: ModerationStatus.PENDING },
      }),
    ]);

  return {
    users,
    cases,
    theories,
    comments,
    pendingReports: reports,
    pendingModeration: moderation,
  };
};

export const getRecentCounts = async (days: number) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [users, cases] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.case.count({ where: { createdAt: { gte: since } } }),
  ]);

  return { users, cases };
};

export const getCasesByCategory = () =>
  prisma.case.groupBy({
    by: ["category"],
    _count: { id: true },
  });

export const getReportsByStatus = () =>
  prisma.report.groupBy({
    by: ["status"],
    _count: { id: true },
  });

export const getRecentUsers = (take: number) =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" as const },
    take,
  });

export const getRecentReports = (take: number) =>
  prisma.report.findMany({
    include: { reporter: { select: { id: true, name: true, username: true } } },
    orderBy: { createdAt: "desc" as const },
    take,
  });
