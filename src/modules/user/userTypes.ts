export interface PublicUser {
  id: string;
  name: string;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
}

export interface UpdateUserInput {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface CaseSummary {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TheorySummary {
  id: string;
  title: string;
  content: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}