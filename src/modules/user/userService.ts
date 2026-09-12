import AppError from "../../shared/utils/AppError.js";
import * as userRepository from "./userRepository.js";
import { PublicUser, UpdateUserInput } from "./userTypes.js";

export const getUserById = async (id: string): Promise<PublicUser> => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const updateUser = async (
  id: string,
  requesterId: string,
  data: UpdateUserInput,
): Promise<PublicUser> => {
  if (id !== requesterId) {
    throw new AppError("You can only update your own profile", 403);
  }

  await getUserById(id);

  if (data.username) {
    const existing = await userRepository.findUserByUsername(data.username);
    if (existing && existing.id !== id) {
      throw new AppError("Username already taken", 409);
    }
  }

  return userRepository.updateUser(id, data);
};

export const getUserCases = async (userId: string) => {
  await getUserById(userId);
  return userRepository.findCasesByUserId(userId);
};

export const getUserTheories = async (userId: string) => {
  await getUserById(userId);
  return userRepository.findTheoriesByUserId(userId);
};

export const followUser = async (followerId: string, targetId: string): Promise<void> => {
  if (followerId === targetId) {
    throw new AppError("You cannot follow yourself", 400);
  }

  await getUserById(targetId);

  const existing = await userRepository.findFollow(followerId, targetId);
  if (existing) {
    throw new AppError("Already following this user", 409);
  }

  await userRepository.createFollow(followerId, targetId);
};

export const unfollowUser = async (followerId: string, targetId: string): Promise<void> => {
  const existing = await userRepository.findFollow(followerId, targetId);
  if (!existing) {
    throw new AppError("You are not following this user", 404);
  }

  await userRepository.deleteFollow(followerId, targetId);
};

export const getFollowers = async (userId: string) => {
  await getUserById(userId);
  const rows = await userRepository.findFollowers(userId);
  return rows.map((row) => row.follower);
};

export const getFollowing = async (userId: string) => {
  await getUserById(userId);
  const rows = await userRepository.findFollowing(userId);
  return rows.map((row) => row.following);
};

export const searchUsers = async (query: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return userRepository.searchUsers(query, skip, limit);
};