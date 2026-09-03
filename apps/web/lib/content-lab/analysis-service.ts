import { db } from '@aphrodite/database';
import type { ContentDNA } from './types';

export async function runAnalysis(analysisId: string): Promise<void> {
  const analysis = await db.contentAnalysis.findUnique({
    where: { id: analysisId },
    include: { reference: true },
  });

  if (!analysis) throw new Error('Analysis not found');

  await db.contentAnalysis.update({
    where: { id: analysisId },
    data: { status: 'PROCESSING' },
  });

  try {
    const ref = analysis.reference;

    const engagement = computeEngagement(ref.views, ref.likes, ref.comments, ref.shares, ref.saves);

    const hookData = {
      hookType: 'unknown',
      hookTiming: ref.duration && ref.duration > 0 ? '0-2s' : undefined,
    };

    const pacingData = {
      duration: ref.duration ?? undefined,
    };

    const contentDna: ContentDNA = {
      hook: hookData,
      pacing: pacingData,
      engagementSignals: engagement,
      archetype: undefined,
      confidence: { overall: 0.3 },
    };

    await db.contentAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'COMPLETED',
        hook: hookData,
        pacing: pacingData,
        engagement,
        contentDna,
        confidence: { overall: 0.3 },
      },
    });
  } catch (err) {
    await db.contentAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'FAILED',
        error: err instanceof Error ? err.message : 'Unknown error',
      },
    });
  }
}

function computeEngagement(
  views: number | null,
  likes: number | null,
  comments: number | null,
  shares: number | null,
  saves: number | null,
) {
  const result: Record<string, number> = {};
  if (views && views > 0) {
    if (likes) result.engagementRate = ((likes + (comments ?? 0) + (shares ?? 0)) / views) * 100;
    if (shares) result.shareRate = (shares / views) * 100;
    if (saves) result.saveRate = (saves / views) * 100;
  }
  return Object.keys(result).length > 0 ? result : {};
}

export async function getAnalysesForUser(userId: string, characterId?: string) {
  return db.contentAnalysis.findMany({
    where: { userId, ...(characterId ? { characterId } : {}) },
    include: { reference: { select: { title: true, platform: true, sourceType: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
