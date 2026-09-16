import { prisma } from "../../lib/prisma.js";

const publicUserSelect = {
  id: true,
  name: true,
  username: true,
  bio: true,
  avatar: true,
  title: true,
  location: true,
  website: true,
  createdAt: true,
};

export const findUserById = (id: string) =>
  prisma.user.findUnique({ where: { id }, select: publicUserSelect });

export const findUserByUsername = (username: string) =>
  prisma.user.findUnique({ where: { username } });

export const updateUser = (
  id: string,
  data: { name?: string; username?: string; bio?: string; avatar?: string; title?: string; location?: string; website?: string },
) => prisma.user.update({ where: { id }, data, select: publicUserSelect });

export const findCasesByUserId = (userId: string) =>
  prisma.case.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

export const findTheoriesByUserId = (userId: string) =>
  prisma.theory.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

export const findFollow = (followerId: string, followingId: string) =>
  prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

export const createFollow = (followerId: string, followingId: string) =>
  prisma.follow.create({ data: { followerId, followingId } });

export const deleteFollow = (followerId: string, followingId: string) =>
  prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });

export const findFollowers = (userId: string) =>
  prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: { select: publicUserSelect } },
    orderBy: { createdAt: "desc" },
  });

export const findFollowing = (userId: string) =>
  prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: { select: publicUserSelect } },
    orderBy: { createdAt: "desc" },
  });

export const searchUsers = (query: string, skip: number, take: number) =>
  prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
      ],
    },
    select: publicUserSelect,
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  export const deleteUser = (id: string) =>
  prisma.user.delete({ where: { id } });