export interface CheckCaseInput {
  caseId: string;
}

export interface CheckImageInput {
  fileUrl: string;
  targetType: string;
  targetId: string;
}

export interface ModerationQueueQuery {
  page: number;
  limit: number;
  status?: string;
  targetType?: string;
}