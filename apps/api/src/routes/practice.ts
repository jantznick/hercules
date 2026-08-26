import { Router, type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const KINDS = new Set(['lab', 'tutorial', 'drill']);
const MAX_EVENTS = 100;
const DEFAULT_LIMIT = 40;

type PracticeKind = 'lab' | 'tutorial' | 'drill';

function parseKind(value: unknown): PracticeKind | null {
  if (typeof value !== 'string') return null;
  const kind = value.trim().toLowerCase();
  return KINDS.has(kind) ? (kind as PracticeKind) : null;
}

function parseTargetId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const targetId = value.trim();
  if (!targetId || targetId.length > 200) return null;
  return targetId;
}

function parseLimit(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(n), MAX_EVENTS);
}

router.post('/events', requireAuth, async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const kind = parseKind(req.body?.kind);
  const targetId = parseTargetId(req.body?.targetId);
  if (!kind || !targetId) {
    res.status(400).json({ error: 'kind (lab|tutorial|drill) and targetId are required' });
    return;
  }

  const passed =
    typeof req.body?.passed === 'boolean'
      ? req.body.passed
      : req.body?.passed == null
        ? null
        : Boolean(req.body.passed);

  let meta: object | undefined;
  if (req.body?.meta != null) {
    if (typeof req.body.meta !== 'object' || Array.isArray(req.body.meta)) {
      res.status(400).json({ error: 'meta must be a JSON object' });
      return;
    }
    meta = req.body.meta as object;
  }

  try {
    const event = await prisma.practiceEvent.create({
      data: {
        userId,
        kind,
        targetId,
        passed,
        ...(meta !== undefined ? { meta } : {}),
      },
    });
    res.status(201).json({ event });
  } catch (error) {
    console.error('Failed to record practice event:', error);
    res.status(500).json({ error: 'Failed to record practice event' });
  }
});

router.get('/events', requireAuth, async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const limit = parseLimit(req.query.limit);

  try {
    const events = await prisma.practiceEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    res.json({ events });
  } catch (error) {
    console.error('Failed to list practice events:', error);
    res.status(500).json({ error: 'Failed to list practice events' });
  }
});

/** Latest event per (kind, targetId). */
router.get('/summary', requireAuth, async (req: Request, res: Response) => {
  const userId = req.session.userId!;

  try {
    const events = await prisma.practiceEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const byKey = new Map<
      string,
      {
        kind: string;
        targetId: string;
        passed: boolean | null;
        createdAt: Date;
        meta: unknown;
      }
    >();

    for (const event of events) {
      const key = `${event.kind}:${event.targetId}`;
      if (byKey.has(key)) continue;
      byKey.set(key, {
        kind: event.kind,
        targetId: event.targetId,
        passed: event.passed,
        createdAt: event.createdAt,
        meta: event.meta,
      });
    }

    res.json({ summary: Array.from(byKey.values()) });
  } catch (error) {
    console.error('Failed to summarize practice events:', error);
    res.status(500).json({ error: 'Failed to summarize practice events' });
  }
});

export default router;
