import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { performStaticAnalysis } from '../services/staticAnalysis.js';
import { performAIReview } from '../services/aiReview.js';
import { calculateMetrics } from '../services/metrics.js';

const router = Router();

// Create review from snippet
router.post('/snippet', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;
    const reviewId = uuidv4();

    // Demo mode
    if (demoMode) {
      const review = {
        id: reviewId,
        userId,
        sourceType: 'SNIPPET',
        language,
        codeSnippet: code,
        overallScore: 0,
        summary: 'Processing...',
        status: 'PROCESSING',
        createdAt: new Date().toISOString(),
      };

      demoStorage.reviews.set(reviewId, review);

      // Process review async
      processReview(reviewId, code, language, demoStorage).catch(console.error);

      return res.status(201).json({ reviewId, message: 'Review started' });
    }

    return res.status(500).json({ error: 'Database not configured' });
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to start review' });
  }
});

// Get all reviews for user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (demoMode) {
      const reviews: any[] = [];
      for (const review of demoStorage.reviews.values()) {
        if (review.userId === userId) {
          reviews.push({
            ...review,
            findings: [],
            _count: { findings: 0 },
          });
        }
      }
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return res.json({
        reviews,
        pagination: { page: 1, limit: 10, total: reviews.length, pages: 1 },
      });
    }

    return res.status(500).json({ error: 'Database not configured' });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get single review
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (demoMode) {
      const review = demoStorage.reviews.get(req.params.id);
      if (!review || review.userId !== userId) {
        return res.status(404).json({ error: 'Review not found' });
      }
      return res.json(review);
    }

    return res.status(500).json({ error: 'Database not configured' });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// Delete review
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (demoMode) {
      const review = demoStorage.reviews.get(req.params.id);
      if (!review || review.userId !== userId) {
        return res.status(404).json({ error: 'Review not found' });
      }
      demoStorage.reviews.delete(req.params.id);
      return res.json({ message: 'Review deleted' });
    }

    return res.status(500).json({ error: 'Database not configured' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Async review processing
async function processReview(reviewId: string, code: string, language: string, demoStorage: any) {
  try {
    // Static Analysis
    const staticResults = await performStaticAnalysis(code, language);
    
    // AI Review
    const aiResults = await performAIReview(code, language);
    
    // Calculate Metrics
    const metrics = calculateMetrics(code, language);
    
    // Calculate overall score
    const overallScore = Math.round(100 - staticResults.issues.length * 5 - aiResults.issues.length * 3);

    // Combine findings
    const findings = [
      ...staticResults.issues.map((i: any) => ({ ...i, id: uuidv4() })),
      ...aiResults.issues.map((i: any) => ({ ...i, id: uuidv4() })),
    ];

    // Update review
    demoStorage.reviews.set(reviewId, {
      ...demoStorage.reviews.get(reviewId),
      status: 'COMPLETED',
      overallScore: Math.max(0, Math.min(100, overallScore)),
      summary: aiResults.summary,
      findings,
      metrics,
    });

    console.log(`Review ${reviewId} completed`);
  } catch (error) {
    console.error(`Review ${reviewId} failed:`, error);
    demoStorage.reviews.set(reviewId, {
      ...demoStorage.reviews.get(reviewId),
      status: 'FAILED',
    });
  }
}

export default router;
