import { Request, Response, NextFunction } from "express";
import * as groupService from "./groupService.js";
import sendResponse from "../../shared/utils/response.js";
import AppError from "../../shared/utils/AppError.js";
import { GroupRole } from "../../../generated/prisma/client.js";

export const createGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const created = await groupService.createGroup(userId, req.body);
    sendResponse(res, 201, true, "Group created successfully", created);
  } catch (error) {
    next(error);
  }
};

export const listGroups = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1),
      50,
    );
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const result = await groupService.listGroups({ search, page, limit });
    sendResponse(res, 200, true, "Groups fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const group = await groupService.getGroupById(
      req.params.id as string,
      requester?.id,
    );
    sendResponse(res, 200, true, "Group fetched successfully", group);
  } catch (error) {
    next(error);
  }
};

export const updateGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const updated = await groupService.updateGroup(
      req.params.id as string,
      requester.id,
      requester.role,
      req.body,
    );
    sendResponse(res, 200, true, "Group updated successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    await groupService.deleteGroup(
      req.params.id as string,
      requester.id,
      requester.role,
    );
    sendResponse(res, 200, true, "Group deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const created = await groupService.inviteMember(
      req.params.id as string,
      requester.id,
      requester.role,
      req.body.userId,
    );
    sendResponse(res, 201, true, "User added to group successfully", created);
  } catch (error) {
    next(error);
  }
};

export const joinGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const created = await groupService.joinGroup(
      req.params.id as string,
      userId,
    );
    sendResponse(res, 201, true, "Joined group successfully", created);
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await groupService.leaveGroup(req.params.id as string, userId);
    sendResponse(res, 200, true, "Left group successfully", null);
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const members = await groupService.getMembers(
      req.params.id as string,
      requester?.id,
    );
    sendResponse(res, 200, true, "Members fetched successfully", members);
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const role = req.body.role as GroupRole;
        // Explicit checks help TypeScript narrow the type correctly
    if (role !== GroupRole.ADMIN && role !== GroupRole.MEMBER) {
      throw new AppError("Role must be ADMIN or MEMBER", 400);
    }
    if (![GroupRole.ADMIN, GroupRole.MEMBER].includes(role)) {
      throw new AppError("Role must be ADMIN or MEMBER", 400);
    }

    const updated = await groupService.updateMemberRole(
      req.params.id as string,
      req.params.memberId as string,
      requester.id,
      requester.role,
      role as "ADMIN" | "MEMBER",
    );
    sendResponse(res, 200, true, "Member role updated successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    await groupService.removeMember(
      req.params.id as string,
      req.params.memberId as string,
      requester.id,
      requester.role,
    );
    sendResponse(res, 200, true, "Member removed successfully", null);
  } catch (error) {
    next(error);
  }
};

export const createChannel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const created = await groupService.createChannel(
      req.params.id as string,
      requester.id,
      requester.role,
      req.body,
    );
    sendResponse(res, 201, true, "Channel created successfully", created);
  } catch (error) {
    next(error);
  }
};

export const getChannels = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const channels = await groupService.getChannels(
      req.params.id as string,
      requester.id,
    );
    sendResponse(res, 200, true, "Channels fetched successfully", channels);
  } catch (error) {
    next(error);
  }
};

export const updateChannel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    const updated = await groupService.updateChannel(
      req.params.id as string,
      requester.id,
      requester.role,
      req.body,
    );
    sendResponse(res, 200, true, "Channel updated successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteChannel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requester = (req as any).user;
    await groupService.deleteChannel(
      req.params.id as string,
      requester.id,
      requester.role,
    );
    sendResponse(res, 200, true, "Channel deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
