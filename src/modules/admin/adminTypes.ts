export interface AdminUserQuery {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface AdminCaseQuery {
  page: number;
  limit: number;
  search?: string;
  publishState?: string;
  category?: string;
}

export interface AdminReportQuery {
  page: number;
  limit: number;
  status?: string;
  targetType?: string;
}

export interface AdminModerationQuery {
  page: number;
  limit: number;
  status?: string;
  targetType?: string;
}

export interface UpdateReportInput {
  status?: string;
  adminNotes?: string;
}