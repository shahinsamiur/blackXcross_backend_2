import { prisma } from "../../lib/prisma.js";
import { GroupRole, Prisma } from "../../../generated/prisma/client.js";

const memberSelect = {
  user: { select: { id: true, name: true, username: true, avatar: true } },
};

export const createGroup = (data: { name: string; description?: string; isPrivate?: boolean }) =>
  prisma.group.create({ data });

export const findGroupById = (id: string) =>
  prisma.group.findUnique({
    where: { id },
    include: { _count: { select: { members: true, channels: true } } },
  });

export const updateGroup = (
  id: string,
  data: { name?: string; description?: string; isPrivate?: boolean },
) => prisma.group.update({ where: { id }, data });

export const deleteGroup = (id: string) => prisma.group.delete({ where: { id } });

export const findGroups = (where: Prisma.GroupWhereInput, skip: number, take: number) =>
  prisma.group.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { members: true } } },
  });

export const countGroups = (where: Prisma.GroupWhereInput) => prisma.group.count({ where });

export const createMember = (groupId: string, userId: string, role: GroupRole) =>
  prisma.groupMember.create({ data: { groupId, userId, role }, include: memberSelect });

export const findMember = (groupId: string, userId: string) =>
  prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId } } });

export const findMembers = (groupId: string) =>
  prisma.groupMember.findMany({
    where: { groupId },
    include: memberSelect,
    orderBy: { joinedAt: "asc" },
  });

export const updateMemberRole = (groupId: string, userId: string, role: GroupRole) =>
  prisma.groupMember.update({
    where: { groupId_userId: { groupId, userId } },
    data: { role },
    include: memberSelect,
  });

export const deleteMember = (groupId: string, userId: string) =>
  prisma.groupMember.delete({ where: { groupId_userId: { groupId, userId } } });

export const createChannel = (data: { groupId: string; name: string; description?: string }) =>
  prisma.channel.create({ data });

export const findChannelsByGroupId = (groupId: string) =>
  prisma.channel.findMany({ where: { groupId }, orderBy: { createdAt: "asc" } });

export const findChannelById = (id: string) => prisma.channel.findUnique({ where: { id } });

export const updateChannel = (id: string, data: { name?: string; description?: string }) =>
  prisma.channel.update({ where: { id }, data });

export const deleteChannel = (id: string) => prisma.channel.delete({ where: { id } });