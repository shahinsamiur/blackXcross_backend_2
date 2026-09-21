import { prisma } from "../../lib/prisma.js";
import { PublishState } from "../../../generated/prisma/client.js";

export const getDashboardData = async () => {
  const [recentCases, trendingTheories, recentComments, stats] = await Promise.all([
    prisma.case.findMany({
      where: { publishState: PublishState.PUBLISHED },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        user: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { theories: true } }
      }
    }),
    prisma.theory.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { id: true, name: true, username: true, avatar: true } },
        case: { select: { id: true, title: true } },
        _count: { select: { upvotes: true, comments: true } }
      }
    }),

    prisma.comment.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, username: true, avatar: true } },
        theory: { 
          select: { 
            id: true,
            case: { select: { id: true, title: true } }
          } 
        }
      }
    }),
    prisma.$transaction([
      prisma.case.count(),
      prisma.theory.count(),
      prisma.user.count()
    ])
  ]);

  return {
    recentCases: recentCases.map(({ user, ...rest }) => ({
      ...rest,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatar
      }
    })),
    trendingTheories: trendingTheories.map(({ user, _count, ...rest }) => ({
      ...rest,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatar
      },
      _count: {
        theoryUpvotes: _count.upvotes,
        comments: _count.comments
      }
    })),

    recentActivity: recentComments.map((c) => ({
      id: c.id,
      type: "COMMENT" as const,
      author: {
        id: c.user.id,
        name: c.user.name,
        username: c.user.username,
        avatarUrl: c.user.avatar
      },
      caseTitle: c.theory?.case?.title,
      createdAt: c.createdAt
    })),
    stats: {
      totalCases: stats[0],
      totalTheories: stats[1],
      totalUsers: stats[2]
    }
  };
};