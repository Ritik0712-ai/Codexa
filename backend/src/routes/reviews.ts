import { Router, Request, Response } from 'express';
import { PrismaClient, ReviewStatus, Severity } from '@prisma/client';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { performStaticAnalysis } from '../services/staticAnalysis.js';
import { performAIReview } from '../services/aiReview.js';
import { calculateMetrics } from '../services/metrics.js';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createSnippetReviewSchema = z.object({
  code: z.string().min(1),
  language: z.string().min(1),
});

const createFileReviewSchema = z.object({
  fileId: z.string().uuid(),
  language: z.string().min(1),
});

// Create review from snippet
router.post('/snippet', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = createSnippetReviewSchema.parse(req.body);
    
    // Create review record
    const review = await prisma.review.create({
      data: {
        userId,
        sourceType: 'SNIPPET',
        language: data.language,
        codeSnippet: data.code,
        status: 'PROCESSING',
        summary: 'Processing...',
      },
    });

    // Start async review process
    processReview(review.id, data.code, data.language).catch(console.error);

    res.status(201).json({ 
      reviewId: review.id,
      message: 'Review started'
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create snippet review error:', error);
    res.status(500).json({ error: 'Failed to start review' });
  }
});

// Create review from uploaded file
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = createFileReviewSchema.parse(req.body);
    
    // Get file
    const file = await prisma.uploadedFile.findFirst({
      where: { id: data.fileId, userId },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Create review record
    const review = await prisma.review.create({
      data: {
        userId,
        fileId: file.id,
        sourceType: 'FILE',
        language: data.language,
        status: 'PROCESSING',
        summary: 'Processing...',
      },
    });

    // Read file content (in real app, this would come from storage)
    const code = '// File content would be read from storage';
    
    // Start async review process
    processReview(review.id, code, data.language).catch(console.error);

    res.status(201).json({ 
      reviewId: review.id,
      message: 'Review started'
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create file review error:', error);
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;

    const where: any = { userId };
    
    if (search) {
      where.OR = [
        { summary: { contains: search, mode: 'insensitive' } },
        { language: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          metrics: true,
          _count: { select: { findings: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
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

    const review = await prisma.review.findFirst({
      where: { id: req.params.id, userId },
      include: {
        findings: { orderBy: { severity: 'asc' } },
        metrics: true,
        file: true,
      },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
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

    const review = await prisma.review.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.review.delete({ where: { id: req.params.id } });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE',
        entityType: 'REVIEW',
        entityId: req.params.id,
        ipAddress: req.ip,
      },
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Async review processing function
async function processReview(reviewId: string, code: string, language: string) {
  try {
    // 1. Static Analysis
    const staticResults = await performStaticAnalysis(code, language);
    
    // 2. AI Review
    const aiResults = await performAIReview(code, language);
    
    // 3. Calculate Metrics
    const metrics = calculateMetrics(code, language);
    
    // 4. Calculate overall score
    const overallScore = Math.round(
      (100 - staticResults.issues.length * 5 - aiResults.issues.length * 3)
    );

    // 5. Update review with results
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        status: 'COMPLETED',
        overallScore: Math.max(0, Math.min(100, overallScore)),
        summary: aiResults.summary,
      },
    });

    // 6. Create findings
    const findings = [...staticResults.issues, ...aiResults.issues];
    for (const finding of findings) {
      await prisma.reviewFinding.create({
        data: {
          reviewId,
          severity: finding.severity as Severity,
          category: finding.category,
          issue: finding.issue,
          explanation: finding.explanation,
          suggestedFix: finding.suggestedFix,
          fileName: finding.fileName,
          lineNumber: finding.lineNumber,
        },
      });
    }

    // 7. Create metrics
    await prisma.reviewMetric.create({
      data: {
        reviewId,
        linesOfCode: metrics.linesOfCode,
        functions: metrics.functions,
        classes: metrics.classes,
        cyclomaticComplexity: metrics.cyclomaticComplexity,
        fileComplexity: metrics.fileComplexity,
      },
    });

    console.log(`Review ${reviewId} completed successfully`);
  } catch (error) {
    console.error(`Review ${reviewId} failed:`, error);
    await prisma.review.update({
      where: { id: reviewId },
      data: { status: 'FAILED' },
    });
  }
}

export default router;
