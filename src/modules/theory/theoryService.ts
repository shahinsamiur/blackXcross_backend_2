import AppError from "../../shared/utils/AppError.js";
import { Role, PublishState, Prisma } from "../../../generated/prisma/client.js";
import * as theoryRepository from "./theoryRepository.js";
import * as caseRepository from "../case/caseRepository.js";
import { AdminTheoryQuery } from "./theoryTypes.js";

const assertOwner = (theory: { userId: string }, requesterId: string, requesterRole: Role) => {
  if (theory.userId !== requesterId && requesterRole !== Role.ADMIN) {
    throw new AppError("You do not have permission to modify this theory", 403);
  }
};

export const createTheory = async (caseId: string, userId: string, data: { title: string; content?: string }) => {
  const caseRecord = await caseRepository.findCaseById(caseId);
  if (!caseRecord) {
    throw new AppError("Case not found", 404);
  }

  return theoryRepository.createTheory({ ...data, userId, caseId });
};

export const getTheoriesByCaseId = async (caseId: string, requesterId?: string, requesterRole?: Role) => {
  const caseRecord = await caseRepository.findCaseById(caseId);
  if (!caseRecord) {
    throw new AppError("Case not found", 404);
  }

  if (caseRecord.publishState === PublishState.DRAFT && caseRecord.userId !== requesterId && requesterRole !== Role.ADMIN) {
    throw new AppError("Case not found", 404);
  }

  const theories = await theoryRepository.findTheoriesByCaseId(caseId, requesterId);
  return theories.map(({ upvotes, ...theory }) => ({
    ...theory,
    upvotedByMe: upvotes.length > 0,
  }));
};

export const getTheoryById = async (id: string, requesterId?: string, requesterRole?: Role) => {
  const theory = await theoryRepository.findTheoryById(id);
  if (!theory) {
    throw new AppError("Theory not found", 404);
  }

  const caseRecord = await caseRepository.findCaseById(theory.caseId);
  if (caseRecord && caseRecord.publishState === PublishState.DRAFT && caseRecord.userId !== requesterId && requesterRole !== Role.ADMIN) {
    throw new AppError("Theory not found", 404);
  }

  return theory;
};

export const getAllTheories = async (requesterRole: Role | undefined, query: AdminTheoryQuery) => {
  if (requesterRole !== Role.ADMIN) {
    throw new AppError("Forbidden: Admin access required", 403);
  }

  const where: Prisma.TheoryWhereInput = {};
  if (query.search) {
    where.title = { contains: query.search, mode: "insensitive" };
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    theoryRepository.findAllTheories(where, skip, query.limit),
    theoryRepository.countAllTheories(where),
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

export const updateTheory = async (id: string, requesterId: string, requesterRole: Role, data: { title?: string; content?: string }) => {
  const theory = await theoryRepository.findTheoryById(id);
  if (!theory) {
    throw new AppError("Theory not found", 404);
  }
  assertOwner(theory, requesterId, requesterRole);

  return theoryRepository.updateTheory(id, data);
};

export const deleteTheory = async (id: string, requesterId: string, requesterRole: Role) => {
  const theory = await theoryRepository.findTheoryById(id);
  if (!theory) {
    throw new AppError("Theory not found", 404);
  }
  assertOwner(theory, requesterId, requesterRole);

  await theoryRepository.deleteTheory(id);
};

export const upvoteTheory = async (id: string, userId: string) => {
  const theory = await theoryRepository.findTheoryById(id);
  if (!theory) {
    throw new AppError("Theory not found", 404);
  }

  const removed = await theoryRepository.removeUpvote(userId, id);
  if (removed.count > 0) {
    return { upvoted: false };
  }

  try {
    await theoryRepository.upvoteTheory(userId, id);
  } catch (error: any) {
    if (error.code !== "P2002") throw error;
  }
  return { upvoted: true };
};

export const removeUpvote = async (id: string, userId: string) => {
  const theory = await theoryRepository.findTheoryById(id);
  if (!theory) {
    throw new AppError("Theory not found", 404);
  }

  await theoryRepository.removeUpvote(userId, id);
};