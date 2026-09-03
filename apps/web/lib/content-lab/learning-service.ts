import { db } from '@aphrodite/database';

export interface InsightResult {
  dimension: string;
  insight: string;
  evidence: Array<{ conceptId: string; metric: string; value: number }>;
  sampleSize: number;
  metric: string;
  baseline: number | null;
  observed: number | null;
  effect: number | null;
  confidence: number | null;
}

export async function generateInsights(
  userId: string,
  characterId: string,
): Promise<InsightResult[]> {
  const performances = await db.contentPerformance.findMany({
    where: { userId, characterId },
    include: {
      concept: {
        select: {
          id: true,
          scenePlan: true,
          hashtags: true,
          platform: true,
          estimatedDuration: true,
          metadata: true,
        },
      },
    },
    orderBy: { measuredAt: 'desc' },
    take: 200,
  });

  if (performances.length < 3) {
    return [];
  }

  const insights: InsightResult[] = [];

  const viewValues = performances
    .filter((p) => p.views != null && p.views > 0)
    .map((p) => p.views!);

  if (viewValues.length >= 3) {
    const medianViews = median(viewValues);

    const byPlatform = new Map<string, number[]>();
    for (const p of performances) {
      if (p.views != null && p.views > 0) {
        const arr = byPlatform.get(p.platform) ?? [];
        arr.push(p.views);
        byPlatform.set(p.platform, arr);
      }
    }

    for (const [platform, vals] of byPlatform) {
      if (vals.length >= 2) {
        const platformMedian = median(vals);
        const effect = medianViews > 0 ? platformMedian / medianViews : null;
        if (effect && Math.abs(effect - 1) > 0.15) {
          const direction = effect > 1 ? 'higher' : 'lower';
          insights.push({
            dimension: 'platform',
            insight: `Content on ${platform} is associated with ${direction} view performance (${effect.toFixed(1)}x median).`,
            evidence: vals.map((v, i) => ({
              conceptId: performances[i]?.concept?.id ?? '',
              metric: 'views',
              value: v,
            })),
            sampleSize: vals.length,
            metric: 'views',
            baseline: medianViews,
            observed: platformMedian,
            effect,
            confidence: Math.min(vals.length / 10, 1),
          });
        }
      }
    }

    const withDuration = performances.filter(
      (p) => p.views != null && p.views > 0 && p.concept?.estimatedDuration != null,
    );
    if (withDuration.length >= 3) {
      const short = withDuration.filter((p) => (p.concept?.estimatedDuration ?? 0) <= 15);
      const long = withDuration.filter((p) => (p.concept?.estimatedDuration ?? 0) > 15);

      if (short.length >= 2 && long.length >= 2) {
        const shortMedian = median(short.map((p) => p.views!));
        const longMedian = median(long.map((p) => p.views!));
        const effect = medianViews > 0 ? shortMedian / longMedian : null;
        if (effect && Math.abs(effect - 1) > 0.15) {
          const better = effect > 1 ? 'Short (≤15s)' : 'Longer (>15s)';
          insights.push({
            dimension: 'duration',
            insight: `${better} content has performed better historically (${Math.max(effect, 1 / effect).toFixed(1)}x median views).`,
            evidence: [],
            sampleSize: withDuration.length,
            metric: 'views',
            baseline: medianViews,
            observed: effect > 1 ? shortMedian : longMedian,
            effect: Math.max(effect, 1 / effect),
            confidence: Math.min(withDuration.length / 10, 1),
          });
        }
      }
    }
  }

  return insights;
}

export async function persistInsights(
  userId: string,
  characterId: string,
  insights: InsightResult[],
) {
  for (const insight of insights) {
    await db.contentInsight.create({
      data: {
        userId,
        characterId,
        dimension: insight.dimension,
        insight: insight.insight,
        evidence: insight.evidence,
        sampleSize: insight.sampleSize,
        metric: insight.metric,
        baseline: insight.baseline,
        observed: insight.observed,
        effect: insight.effect,
        confidence: insight.confidence,
      },
    });
  }
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}
