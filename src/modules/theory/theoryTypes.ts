export interface CreateTheoryInput {
  title: string;
  content?: string;
}

export interface UpdateTheoryInput {
  title?: string;
  content?: string;
}

export interface AdminTheoryQuery {
  page: number;
  limit: number;
  search?: string;
}