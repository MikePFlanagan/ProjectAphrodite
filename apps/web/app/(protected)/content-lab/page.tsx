import { db } from '@aphrodite/database';
import { requireUser } from '@/lib/require-auth';
import { ContentLabDashboard } from '@/components/content-lab/ContentLabDashboard';

export default async function ContentLabPage() {
  const user = await requireUser();

  const characters = await db.character.findMany({
    where: { creatorId: user.id },
    select: { id: true, name: true, tagline: true, avatarUrl: true, category: true, traits: true },
    orderBy: { updatedAt: 'desc' },
  });

  const recentAnalyses = await db.contentAnalysis.findMany({
    where: { userId: user.id },
    include: { reference: { select: { title: true, platform: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const recentConcepts = await db.contentConcept.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, platform: true, characterId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const recentJobs = await db.contentGenerationJob.findMany({
    where: { userId: user.id },
    select: { id: true, provider: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const recentPlans = await db.contentPlan.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, startDate: true, endDate: true, _count: { select: { items: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <ContentLabDashboard
      characters={characters}
      recentAnalyses={recentAnalyses as any}
      recentConcepts={recentConcepts}
      recentJobs={recentJobs}
      recentPlans={recentPlans as any}
    />
  );
}
