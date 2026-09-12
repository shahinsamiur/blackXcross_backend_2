export interface CreateCommentInput {
  content: string;
  userId: string;
  theoryId: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  content: string;
}