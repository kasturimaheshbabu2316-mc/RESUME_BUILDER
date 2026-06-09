import type { Router, Response } from 'express';
import { Router as createRouter } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router: Router = createRouter();

// Validation schemas
const createResumeSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  templateId: z.string().default('classic'),
  data: z.record(z.unknown()), // ResumeState JSON
});

const updateResumeSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  templateId: z.string().optional(),
  data: z.record(z.unknown()).optional(),
});

// GET /api/resumes - List all user's resumes
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        title: true,
        templateId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/resumes/:id - Get single resume
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/resumes - Create new resume
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, templateId, data } = createResumeSchema.parse(req.body);

    const resume = await prisma.resume.create({
      data: {
        userId: req.userId!,
        title: title || 'Untitled Resume',
        templateId,
        data: data || {},
      },
    });

    res.status(201).json({ resume });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/resumes/:id - Update resume
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = updateResumeSchema.parse(req.body);

    // Verify ownership
    const existing = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const resume = await prisma.resume.update({
      where: { id },
      data: updates,
    });

    res.json({ resume });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/resumes/:id - Delete resume
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    await prisma.resume.delete({
      where: { id },
    });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
