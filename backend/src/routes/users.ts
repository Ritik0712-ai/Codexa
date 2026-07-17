import { Router, Request, Response } from 'express';

const router = Router();

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (demoMode) {
      for (const user of demoStorage.users.values()) {
        if (user.id === userId) {
          return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          });
        }
      }
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(500).json({ error: 'Database not configured' });
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

    const { name } = req.body;
    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (demoMode) {
      const user = demoStorage.users.get(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.name = name || user.name;
      return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    }

    return res.status(500).json({ error: 'Database not configured' });
  } catch (error) {
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

    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (demoMode) {
      const userReviews: any[] = [];
      for (const review of demoStorage.reviews.values()) {
        if (review.userId === userId) {
          userReviews.push(review);
        }
      }

      const completedReviews = userReviews.filter(r => r.status === 'COMPLETED');
      const avgScore = completedReviews.length > 0
        ? Math.round(completedReviews.reduce((sum, r) => sum + r.overallScore, 0) / completedReviews.length)
        : 0;

      // Group by language
      const byLanguage: Record<string, number> = {};
      for (const review of completedReviews) {
        byLanguage[review.language] = (byLanguage[review.language] || 0) + 1;
      }

      return res.json({
        totalReviews: completedReviews.length,
        avgScore,
        reviewsByLanguage: Object.entries(byLanguage).map(([language, count]) => ({ language, count })),
        recentActivity: completedReviews.slice(0, 5).map(r => ({
          id: r.id,
          language: r.language,
          overallScore: r.overallScore,
          status: r.status,
          createdAt: r.createdAt,
        })),
      });
    }

    return res.status(500).json({ error: 'Database not configured' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
