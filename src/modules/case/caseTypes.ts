import { CaseCategory, InvestigationStatus } from "../../../generated/prisma/client.js";

export interface CreateCaseInput {
  title: string;
  description?: string;
  category: CaseCategory;
  tags?: string[];
}

export interface UpdateCaseInput {
  title?: string;
  description?: string;
  category?: CaseCategory;
  investigationStatus?: InvestigationStatus;
  tags?: string[];
}

export interface CaseSearchQuery {
  search?: string;
  category?: CaseCategory;
  status?: InvestigationStatus;
  tag?: string;
  sort: "newest" | "oldest";
  page: number;
  limit: number;
}

export interface CaseFileInput {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}