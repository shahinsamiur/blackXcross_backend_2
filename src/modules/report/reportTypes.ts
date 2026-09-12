export interface CreateReportInput {
  targetType: string;
  targetId: string;
  reason: string;
}

export interface UpdateReportInput {
  status?: string;
  adminNotes?: string;
}

export interface ReportSearchQuery {
  page: number;
  limit: number;
  status?: string;
  targetType?: string;
}