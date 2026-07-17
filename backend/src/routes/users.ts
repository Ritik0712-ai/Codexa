import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update profile
router.put('/me', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get user stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [totalReviews, avgScore, reviewsByLanguage, recentActivity] = await Promise.all([
      prisma.review.count({ where: { userId } }),
      prisma.review.aggregate({
        where: { userId, status: 'COMPLETED' },
        _avg: { overallScore: true },
      }),
      prisma.review.groupBy({
        by: ['language'],
        where: { userId },
        _count: true,
      }),
      prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          language: true,
          overallScore: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      totalReviews,
      avgScore: Math.round(avgScore._avg.overallScore || 0),
      reviewsByLanguage: reviewsByLanguage.map(l => ({
        language: l.language,
        count: l._count,
      })),
      recentActivity,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
