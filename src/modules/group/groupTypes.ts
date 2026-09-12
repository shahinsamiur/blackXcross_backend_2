import { GroupRole } from "../../../generated/prisma/client.js";

export interface CreateGroupInput {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface UpdateGroupInput {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface GroupSearchQuery {
  search?: string;
  page: number;
  limit: number;
}

export interface CreateChannelInput {
  name: string;
  description?: string;
}

export interface UpdateChannelInput {
  name?: string;
  description?: string;
}

export type AssignableGroupRole = Extract<GroupRole, "ADMIN" | "MEMBER">;