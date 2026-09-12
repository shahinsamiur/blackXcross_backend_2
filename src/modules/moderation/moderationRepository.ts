import { prisma } from "../../lib/prisma.js";
import { Prisma, ModerationTargetType, ModerationStatus } from "../../../generated/prisma/client.js";

const moderationInclude = {
  reviewer: { select: { id: true, name: true, username: true } },
};

export const createModerationItem = (data: {
  targetType: ModerationTargetType;
  targetId: string;
  reason?: string;
  fileUrl?: string;
}) => prisma.moderationItem.create({
  data,
  include: moderationInclude,
});

export const findModerationItems = (where: Prisma.ModerationItemWhereInput, skip: number, take: number) =>
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
  prisma.moderationItem.findUnique({ where: { id }, include: moderationInclude });

export const updateModerationItem = (id: string, data: { status: ModerationStatus; reviewedBy: string }) =>
  prisma.moderationItem.update({ where: { id }, data, include: moderationInclude });

export const findCaseById = (id: string) =>
  prisma.case.findUnique({
    where: { id },
    select: { id: true, title: true, description: true },
  });