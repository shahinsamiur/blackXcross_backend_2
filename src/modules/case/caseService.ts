import AppError from "../../shared/utils/AppError.js";
import * as caseRepository from "./caseRepository.js";
import { PublishState, Role, Prisma } from "../../../generated/prisma/client.js";
import { CreateCaseInput, UpdateCaseInput, CaseSearchQuery, CaseFileInput } from "./caseTypes.js";

const assertOwner = (
  caseRecord: { userId: string },
  requesterId: string,
  requesterRole: Role,
): void => {
  if (caseRecord.userId !== requesterId && requesterRole !== Role.ADMIN) {
    throw new AppError("You do not have permission to modify this case", 403);
  }
};
const assertEditable = (
  caseRecord: { publishState: PublishState },
  requesterRole: Role,
): void => {
  if (
    caseRecord.publishState === PublishState.PUBLISHED &&
    requesterRole !== Role.ADMIN
  ) {
    throw new AppError("Published cases can no longer be edited", 403);
  }
};
export const createCase = (userId: string, data: CreateCaseInput) =>
  caseRepository.createCase({ ...data, userId });

export const getCaseById = async (id: string, requesterId?: string, requesterRole?: Role) => {
  const found = await caseRepository.findCaseById(id);
  if (!found) {
    throw new AppError("Case not found", 404);
  }

  const isOwner = requesterId === found.userId;
  const isAdmin = requesterRole === Role.ADMIN;

  if (found.publishState === PublishState.DRAFT && !isOwner && !isAdmin) {
    throw new AppError("Case not found", 404);
  }

  return found;
};

export const updateCase = async (
  id: string,
  requesterId: string,
  requesterRole: Role,
  data: UpdateCaseInput,
) => {
  const found = await caseRepository.findCaseById(id);
  if (!found) {
    throw new AppError("Case not found", 404);
  }
  assertOwner(found, requesterId, requesterRole);

  return caseRepository.updateCase(id, data);
};

export const deleteCase = async (id: string, requesterId: string, requesterRole: Role) => {
  const found = await caseRepository.findCaseById(id);
  if (!found) {
    throw new AppError("Case not found", 404);
  }
  assertOwner(found, requesterId, requesterRole);
  assertEditable(found, requesterRole);
  await caseRepository.deleteCase(id);
};

export const publishCase = async (id: string, requesterId: string, requesterRole: Role) => {
  const found = await caseRepository.findCaseById(id);
  if (!found) {
    throw new AppError("Case not found", 404);
  }
  assertOwner(found, requesterId, requesterRole);

  return caseRepository.setPublishState(id, PublishState.PUBLISHED);
};

export const draftCase = async (id: string, requesterId: string, requesterRole: Role) => {
  const found = await caseRepository.findCaseById(id);
  if (!found) {
    throw new AppError("Case not found", 404);
  }
  assertOwner(found, requesterId, requesterRole);
  if (found.publishState === PublishState.PUBLISHED && requesterRole !== Role.ADMIN) {
    throw new AppError("Published cases cannot be moved back to draft", 403);
  }

  return caseRepository.setPublishState(id, PublishState.DRAFT);
};

export const listCases = async (query: CaseSearchQuery) => {
  const where: Prisma.CaseWhereInput = { publishState: PublishState.PUBLISHED };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.category) where.category = query.category;
  if (query.status) where.investigationStatus = query.status;
  if (query.tag) where.tags = { some: { name: query.tag } };

  const orderBy: Prisma.CaseOrderByWithRelationInput =
    query.sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    caseRepository.findCases(where, orderBy, skip, query.limit),
    caseRepository.countCases(where),
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

export const getCaseTheories = async (caseId: string, requesterId?: string, requesterRole?: Role) => {
  await getCaseById(caseId, requesterId, requesterRole);
  return caseRepository.findTheoriesByCaseId(caseId);
};

export const getCaseFiles = async (caseId: string, requesterId?: string, requesterRole?: Role) => {
  await getCaseById(caseId, requesterId, requesterRole);
  return caseRepository.findFilesByCaseId(caseId);
};

export const addCaseFile = async (
  caseId: string,
  requesterId: string,
  requesterRole: Role,
  file: CaseFileInput,
) => {
  const found = await caseRepository.findCaseById(caseId);
  if (!found) {
    throw new AppError("Case not found", 404);
  }
  assertOwner(found, requesterId, requesterRole);

  return caseRepository.createCaseFile({ caseId, ...file });
};

export const removeCaseFile = async (
  caseId: string,
  fileId: string,
  requesterId: string,
  requesterRole: Role,
) => {
  const found = await caseRepository.findCaseById(caseId);
  if (!found) {
    throw new AppError("Case not found", 404);
  }
  assertOwner(found, requesterId, requesterRole);

  const file = await caseRepository.findCaseFileById(fileId);
  if (!file || file.caseId !== caseId) {
    throw new AppError("File not found", 404);
  }

  await caseRepository.deleteCaseFile(fileId);
};