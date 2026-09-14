export interface DashboardStats {
  totalCases: number;
  totalTheories: number;
  totalUsers: number;
}

export interface DashboardActivity {
  id: string;
  type: "COMMENT" | "CASE" | "THEORY";
  author: {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  caseTitle?: string | null;
  theoryTitle?: string | null;
  createdAt: Date;
}

export interface DashboardResponse {
  recentCases: any[];
  trendingTheories: any[];
  recentActivity: DashboardActivity[];
  stats: DashboardStats;
}