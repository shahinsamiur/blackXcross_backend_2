import { Request, Response, NextFunction } from "express";
import * as userService from "./userService.js";
import sendResponse from "../../shared/utils/response.js";
import AppError from "../../shared/utils/AppError.js";

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id as string);
    sendResponse(res, 200, true, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requesterId = (req as any).user.id;
    const user = await userService.updateUser(req.params.id as string, requesterId, req.body);
    sendResponse(res, 200, true, "Profile updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requesterId = (req as any).user.id;
    const file = (req as any).file;

    if (!file) {
      throw new AppError("No file uploaded", 400);
    }

    const avatarUrl = file.path ?? file.location;
    const user = await userService.updateUser(req.params.id as string, requesterId, { avatar: avatarUrl });
    sendResponse(res, 200, true, "Avatar updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const getUserCases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cases = await userService.getUserCases(req.params.id as string);
    sendResponse(res, 200, true, "Cases fetched successfully", cases);
  } catch (error) {
    next(error);
  }
};

export const getUserTheories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const theories = await userService.getUserTheories(req.params.id as string);
    sendResponse(res, 200, true, "Theories fetched successfully", theories);
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requesterId = (req as any).user.id;
    await userService.followUser(requesterId, req.params.id as string);
    sendResponse(res, 201, true, "User followed successfully", null);
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requesterId = (req as any).user.id;
    await userService.unfollowUser(requesterId, req.params.id as string);
    sendResponse(res, 200, true, "User unfollowed successfully", null);
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const followers = await userService.getFollowers(req.params.id as string);
    sendResponse(res, 200, true, "Followers fetched successfully", followers);
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const following = await userService.getFollowing(req.params.id as string);
    sendResponse(res, 200, true, "Following fetched successfully", following);
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!q) {
      throw new AppError("Search query 'q' is required", 400);
    }

    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);

    const users = await userService.searchUsers(q, page, limit);
    sendResponse(res, 200, true, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requesterId = (req as any).user.id;
    await userService.deleteUser(req.params.id as string, requesterId);
    sendResponse(res, 200, true, "Account deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requesterId = (req as any).user.id;
    const user = await userService.getUserById(requesterId);
    sendResponse(res, 200, true, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};