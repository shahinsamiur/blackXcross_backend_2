import AppError from "../../shared/utils/AppError.js";
import { ModerationTargetType, ModerationStatus, Prisma } from "../../../generated/prisma/client.js";
import * as moderationRepository from "./moderationRepository.js";
import * as aiService from "./aiService.js";
import { ModerationQueueQuery } from "./moderationTypes.js";

export const checkCase = async (caseId: string) => {
  const caseRecord = await moderationRepository.findCaseById(caseId);
  if (!caseRecord) {
    throw new AppError("Case not found", 404);
  }


  const aiResult = await aiService.analyzeCaseContent(
    caseRecord.title, 
    caseRecord.description ?? undefined
  );

  const moderationItem = await moderationRepository.createModerationItem({
    targetType: ModerationTargetType.CASE,
    targetId: caseId,
    reason: aiResult.reason,
  });

  return {
    moderationItem,
    aiAnalysis: aiResult,
  };
};

export const checkImage = async (fileUrl: string, targetType: string, targetId: string) => {
  const aiResult = await aiService.analyzeImage(fileUrl);
  const moderationItem = await moderationRepository.createModerationItem({
    targetType: targetType as ModerationTargetType,
    targetId,
    fileUrl,
    reason: aiResult.reason,
  });

  return {
    moderationItem,
    aiAnalysis: aiResult,
  };
};

export const getModerationQueue = async (query: ModerationQueueQuery) => {
  const where: Prisma.ModerationItemWhereInput = {};

  if (query.status && Object.values(ModerationStatus).includes(query.status as ModerationStatus)) {
    where.status = query.status as ModerationStatus;
  }
  if (query.targetType && Object.values(ModerationTargetType).includes(query.targetType as ModerationTargetType)) {
    where.targetType = query.targetType as ModerationTargetType;
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    moderationRepository.findModerationItems(where, skip, query.limit),
    moderationRepository.countModerationItems(where),
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

export const getModerationItemById = async (id: string) => {
  const item = await moderationRepository.findModerationItemById(id);
  if (!item) {
    throw new AppError("Moderation item not found", 404);
  }
  return item;
};

export const approveModeration = async (id: string, adminId: string) => {
  const item = await moderationRepository.findModerationItemById(id);
  if (!item) {
    throw new AppError("Moderation item not found", 404);
  }
  if (item.status !== ModerationStatus.PENDING) {
    throw new AppError("This item has already been reviewed", 400);
  }

  return moderationRepository.updateModerationItem(id, {
    status: ModerationStatus.APPROVED,
    reviewedBy: adminId,
  });
};

export const rejectModeration = async (id: string, adminId: string) => {
  const item = await moderationRepository.findModerationItemById(id);
  if (!item) {
    throw new AppError("Moderation item not found", 404);
  }
  if (item.status !== ModerationStatus.PENDING) {
    throw new AppError("This item has already been reviewed", 400);
  }

  return moderationRepository.updateModerationItem(id, {
    status: ModerationStatus.REJECTED,
    reviewedBy: adminId,
  });
};