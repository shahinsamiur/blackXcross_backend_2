import AppError from "../../shared/utils/AppError.js";
import {
  UserStatus,
  Role,
  PublishState,
  CaseCategory,
  ReportStatus,
  ReportTargetType,
  ModerationStatus,
  ModerationTargetType,
  Prisma,
} from "../../../generated/prisma/client.js";
import * as adminRepository from "./adminRepository.js";
import {
  AdminUserQuery,
  AdminCaseQuery,
  AdminReportQuery,
  AdminModerationQuery,
  UpdateReportInput,
} from "./adminTypes.js";

export const getDashboard = async () => {
  const [totals, last7, last30, recentUsers, recentReports] = await Promise.all(
    [
      adminRepository.getTotalCounts(),
      adminRepository.getRecentCounts(7),
      adminRepository.getRecentCounts(30),
      adminRepository.getRecentUsers(5),
      adminRepository.getRecentReports(5),
    ],
  );

  return {
    totals,
    growth: {
      last7Days: last7,
      last30Days: last30,
    },
    recentUsers,
    recentReports,
  };
};

export const getUsers = async (query: AdminUserQuery) => {
  const where: Prisma.UserWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { username: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.role && Object.values(Role).includes(query.role as Role)) {
    where.role = query.role as Role;
  }
  if (
    query.status &&
    Object.values(UserStatus).includes(query.status as UserStatus)
  ) {
    where.status = query.status as UserStatus;
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    adminRepository.findUsers(where, skip, query.limit),
    adminRepository.countUsers(where),
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

export const suspendUser = async (id: string) => {
  const user = await adminRepository.findUserById(id);
  if (!user) throw new AppError("User not found", 404);
  if (user.role === Role.ADMIN)
    throw new AppError("Cannot suspend an admin", 403);
  if (user.status === UserStatus.BANNED)
    throw new AppError("User is already banned", 400);

  return adminRepository.updateUserStatus(id, UserStatus.SUSPENDED);
};

export const banUser = async (id: string) => {
  const user = await adminRepository.findUserById(id);
  if (!user) throw new AppError("User not found", 404);
  if (user.role === Role.ADMIN) throw new AppError("Cannot ban an admin", 403);

  return adminRepository.updateUserStatus(id, UserStatus.BANNED);
};

export const getCases = async (query: AdminCaseQuery) => {
  const where: Prisma.CaseWhereInput = {};

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (
    query.publishState &&
    Object.values(PublishState).includes(query.publishState as PublishState)
  ) {
    where.publishState = query.publishState as PublishState;
  }
  if (
    query.category &&
    Object.values(CaseCategory).includes(query.category as CaseCategory)
  ) {
    where.category = query.category as CaseCategory;
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    adminRepository.findCases(where, skip, query.limit),
    adminRepository.countCases(where),
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

export const deleteCase = async (id: string) => {
  const caseRecord = await adminRepository.findCaseById(id);
  if (!caseRecord) throw new AppError("Case not found", 404);

  await adminRepository.deleteCase(id);
};

export const getReports = async (query: AdminReportQuery) => {
  const where: Prisma.ReportWhereInput = {};

  if (
    query.status &&
    Object.values(ReportStatus).includes(query.status as ReportStatus)
  ) {
    where.status = query.status as ReportStatus;
  }
  if (
    query.targetType &&
    Object.values(ReportTargetType).includes(
      query.targetType as ReportTargetType,
    )
  ) {
    where.targetType = query.targetType as ReportTargetType;
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    adminRepository.findReports(where, skip, query.limit),
    adminRepository.countReports(where),
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

export const updateReport = async (
  id: string,
  adminId: string,
  data: UpdateReportInput,
) => {
  const report = await adminRepository.findReportById(id);
  if (!report) throw new AppError("Report not found", 404);

  const updateData: {
    status?: ReportStatus;
    adminNotes?: string;
    resolvedBy?: string;
  } = {};
  if (data.status) updateData.status = data.status as ReportStatus;
  if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;

  if (
    data.status &&
    (data.status === ReportStatus.RESOLVED ||
      data.status === ReportStatus.DISMISSED)
  ) {
    updateData.resolvedBy = adminId;
  }

  return adminRepository.updateReport(id, updateData);
};

export const getModerationQueue = async (query: AdminModerationQuery) => {
  const where: Prisma.ModerationItemWhereInput = {};

  if (
    query.status &&
    Object.values(ModerationStatus).includes(query.status as ModerationStatus)
  ) {
    where.status = query.status as ModerationStatus;
  }
  if (
    query.targetType &&
    Object.values(ModerationTargetType).includes(
      query.targetType as ModerationTargetType,
    )
  ) {
    where.targetType = query.targetType as ModerationTargetType;
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    adminRepository.findModerationItems(where, skip, query.limit),
    adminRepository.countModerationItems(where),
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

export const approveModeration = async (id: string, adminId: string) => {
  const item = await adminRepository.findModerationItemById(id);
  if (!item) throw new AppError("Moderation item not found", 404);
  if (item.status !== ModerationStatus.PENDING) {
    throw new AppError("This item has already been reviewed", 400);
  }

  return adminRepository.updateModerationItem(id, {
    status: ModerationStatus.APPROVED,
    reviewedBy: adminId,
  });
};

export const rejectModeration = async (id: string, adminId: string) => {
  const item = await adminRepository.findModerationItemById(id);
  if (!item) throw new AppError("Moderation item not found", 404);
  if (item.status !== ModerationStatus.PENDING) {
    throw new AppError("This item has already been reviewed", 400);
  }

  return adminRepository.updateModerationItem(id, {
    status: ModerationStatus.REJECTED,
    reviewedBy: adminId,
  });
};

export const getAnalytics = async () => {
  const [totals, last7, last30, casesByCategory, reportsByStatus] =
    await Promise.all([
      adminRepository.getTotalCounts(),
      adminRepository.getRecentCounts(7),
      adminRepository.getRecentCounts(30),
      adminRepository.getCasesByCategory(),
      adminRepository.getReportsByStatus(),
    ]);

  return {
    totals,
    growth: {
      last7Days: last7,
      last30Days: last30,
    },
    casesByCategory: casesByCategory.map((c) => ({
      category: c.category,
      count: c._count.id,
    })),
    reportsByStatus: reportsByStatus.map((r) => ({
      status: r.status,
      count: r._count.id,
    })),
  };
};
