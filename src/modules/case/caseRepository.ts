import { prisma } from "../../lib/prisma.js";
import {
  CaseCategory,
  InvestigationStatus,
  PublishState,
  Prisma,
} from "../../../generated/prisma/client.js";

const caseWithRelations = {
  tags: true,
  files: true,
  user: { select: { id: true, name: true, username: true, avatar: true } },
};

export const createCase = (data: {
  title: string;
  description?: string;
  category: CaseCategory;
  userId: string;
  tags?: string[];
}) =>
  prisma.case.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      userId: data.userId,
      ...(data.tags && data.tags.length > 0
        ? {
            tags: {
              connectOrCreate: data.tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            },
          }
        : {}),
    },
    include: caseWithRelations,
  });

export const findCaseById = (id: string) =>
  prisma.case.findUnique({ where: { id }, include: caseWithRelations });

export const updateCase = (
  id: string,
  data: {
    title?: string;
    description?: string;
    category?: CaseCategory;
    investigationStatus?: InvestigationStatus;
    tags?: string[];
  },
) =>
  prisma.case.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      investigationStatus: data.investigationStatus,
      ...(data.tags
        ? {
            tags: {
              set: [],
              connectOrCreate: data.tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            },
          }
        : {}),
    },
    include: caseWithRelations,
  });

export const deleteCase = (id: string) => prisma.case.delete({ where: { id } });

export const setPublishState = (id: string, publishState: PublishState) =>
  prisma.case.update({
    where: { id },
    data: {
      publishState,
      publishedAt: publishState === PublishState.PUBLISHED ? new Date() : null,
    },
    include: caseWithRelations,
  });

export const findCases = (
  where: Prisma.CaseWhereInput,
  orderBy: Prisma.CaseOrderByWithRelationInput,
  skip: number,
  take: number,
) => prisma.case.findMany({ where, orderBy, skip, take, include: caseWithRelations });

export const countCases = (where: Prisma.CaseWhereInput) => prisma.case.count({ where });

export const findTheoriesByCaseId = (caseId: string) =>
  prisma.theory.findMany({ where: { caseId }, orderBy: { createdAt: "desc" } });

export const createCaseFile = (data: {
  caseId: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}) => prisma.caseFile.create({ data });

export const findFilesByCaseId = (caseId: string) =>
  prisma.caseFile.findMany({ where: { caseId }, orderBy: { createdAt: "desc" } });

export const findCaseFileById = (fileId: string) =>
  prisma.caseFile.findUnique({ where: { id: fileId } });

export const deleteCaseFile = (fileId: string) => prisma.caseFile.delete({ where: { id: fileId } });