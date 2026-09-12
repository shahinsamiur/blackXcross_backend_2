import AppError from "../../shared/utils/AppError.js";
import * as groupRepository from "./groupRepository.js";
import { GroupRole, Role } from "../../../generated/prisma/client.js";
import {
  CreateGroupInput,
  UpdateGroupInput,
  GroupSearchQuery,
  CreateChannelInput,
  UpdateChannelInput,
} from "./groupTypes.js";

const assertGroupExists = async (groupId: string) => {
  const found = await groupRepository.findGroupById(groupId);
  if (!found) {
    throw new AppError("Group not found", 404);
  }
  return found;
};

const assertOwnerOrAdmin = async (groupId: string, userId: string, requesterRole: Role) => {
  if (requesterRole === Role.ADMIN) return; // platform admin override
  const membership = await groupRepository.findMember(groupId, userId);
  if (!membership || (membership.role !== GroupRole.OWNER && membership.role !== GroupRole.ADMIN)) {
    throw new AppError("You do not have permission to manage this group", 403);
  }
};

const assertOwner = async (groupId: string, userId: string, requesterRole: Role) => {
  if (requesterRole === Role.ADMIN) return;
  const membership = await groupRepository.findMember(groupId, userId);
  if (!membership || membership.role !== GroupRole.OWNER) {
    throw new AppError("Only the group owner can perform this action", 403);
  }
};

export const createGroup = async (userId: string, data: CreateGroupInput) => {
  const group = await groupRepository.createGroup(data);
  await groupRepository.createMember(group.id, userId, GroupRole.OWNER);
  return group;
};

export const listGroups = async (query: GroupSearchQuery) => {
  const where = query.search
    ? { name: { contains: query.search, mode: "insensitive" as const } }
    : {};

  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    groupRepository.findGroups(where, skip, query.limit),
    groupRepository.countGroups(where),
  ]);

  return {
    items,
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  };
};

export const getGroupById = async (id: string, requesterId?: string) => {
  const found = await assertGroupExists(id);

  if (found.isPrivate) {
    const isMember = requesterId ? await groupRepository.findMember(id, requesterId) : null;
    if (!isMember) {
      throw new AppError("Group not found", 404);
    }
  }

  return found;
};

export const updateGroup = async (
  id: string,
  requesterId: string,
  requesterRole: Role,
  data: UpdateGroupInput,
) => {
  await assertGroupExists(id);
  await assertOwnerOrAdmin(id, requesterId, requesterRole);
  return groupRepository.updateGroup(id, data);
};

export const deleteGroup = async (id: string, requesterId: string, requesterRole: Role) => {
  await assertGroupExists(id);
  await assertOwner(id, requesterId, requesterRole);
  await groupRepository.deleteGroup(id);
};

export const inviteMember = async (
  groupId: string,
  requesterId: string,
  requesterRole: Role,
  targetUserId: string,
) => {
  await assertGroupExists(groupId);
  await assertOwnerOrAdmin(groupId, requesterId, requesterRole);

  const existing = await groupRepository.findMember(groupId, targetUserId);
  if (existing) {
    throw new AppError("User is already a member of this group", 409);
  }

  return groupRepository.createMember(groupId, targetUserId, GroupRole.MEMBER);
};

export const joinGroup = async (groupId: string, userId: string) => {
  const group = await assertGroupExists(groupId);

  if (group.isPrivate) {
    throw new AppError("This group is private — you need an invite to join", 403);
  }

  const existing = await groupRepository.findMember(groupId, userId);
  if (existing) {
    throw new AppError("You are already a member of this group", 409);
  }

  return groupRepository.createMember(groupId, userId, GroupRole.MEMBER);
};

export const leaveGroup = async (groupId: string, userId: string) => {
  const membership = await groupRepository.findMember(groupId, userId);
  if (!membership) {
    throw new AppError("You are not a member of this group", 404);
  }
  if (membership.role === GroupRole.OWNER) {
    throw new AppError(
      "The owner cannot leave the group — delete the group instead",
      400,
    );
  }

  await groupRepository.deleteMember(groupId, userId);
};

export const getMembers = async (groupId: string, requesterId?: string) => {
  const group = await assertGroupExists(groupId);

  if (group.isPrivate) {
    const isMember = requesterId ? await groupRepository.findMember(groupId, requesterId) : null;
    if (!isMember) {
      throw new AppError("Group not found", 404);
    }
  }

  return groupRepository.findMembers(groupId);
};

export const updateMemberRole = async (
  groupId: string,
  memberId: string,
  requesterId: string,
  requesterRole: Role,
  role: GroupRole,
) => {
  await assertGroupExists(groupId);
  await assertOwner(groupId, requesterId, requesterRole);

  const target = await groupRepository.findMember(groupId, memberId);
  if (!target) {
    throw new AppError("Member not found", 404);
  }
  if (target.role === GroupRole.OWNER) {
    throw new AppError("Cannot change the owner's role", 400);
  }

  return groupRepository.updateMemberRole(groupId, memberId, role);
};

export const removeMember = async (
  groupId: string,
  memberId: string,
  requesterId: string,
  requesterRole: Role,
) => {
  await assertGroupExists(groupId);
  await assertOwnerOrAdmin(groupId, requesterId, requesterRole);

  const target = await groupRepository.findMember(groupId, memberId);
  if (!target) {
    throw new AppError("Member not found", 404);
  }
  if (target.role === GroupRole.OWNER) {
    throw new AppError("Cannot remove the group owner", 400);
  }

  await groupRepository.deleteMember(groupId, memberId);
};

export const createChannel = async (
  groupId: string,
  requesterId: string,
  requesterRole: Role,
  data: CreateChannelInput,
) => {
  await assertGroupExists(groupId);
  await assertOwnerOrAdmin(groupId, requesterId, requesterRole);

  return groupRepository.createChannel({ groupId, ...data });
};

export const getChannels = async (groupId: string, requesterId: string) => {
  await assertGroupExists(groupId);

  const membership = await groupRepository.findMember(groupId, requesterId);
  if (!membership) {
    throw new AppError("You must be a member of this group to view its channels", 403);
  }

  return groupRepository.findChannelsByGroupId(groupId);
};

export const updateChannel = async (
  channelId: string,
  requesterId: string,
  requesterRole: Role,
  data: UpdateChannelInput,
) => {
  const channel = await groupRepository.findChannelById(channelId);
  if (!channel) {
    throw new AppError("Channel not found", 404);
  }
  await assertOwnerOrAdmin(channel.groupId, requesterId, requesterRole);

  return groupRepository.updateChannel(channelId, data);
};

export const deleteChannel = async (
  channelId: string,
  requesterId: string,
  requesterRole: Role,
) => {
  const channel = await groupRepository.findChannelById(channelId);
  if (!channel) {
    throw new AppError("Channel not found", 404);
  }
  await assertOwnerOrAdmin(channel.groupId, requesterId, requesterRole);

  await groupRepository.deleteChannel(channelId);
};