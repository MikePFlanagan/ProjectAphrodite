import type { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

const fallbackLimits: Record<SubscriptionPlan, number> = {
  FREE: 50,
  PREMIUM: 500,
  CREATOR: 1_000,
};

export function effectivePlan(
  subscription?: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
  } | null,
): SubscriptionPlan {
  return subscription && ['ACTIVE', 'TRIALING'].includes(subscription.status)
    ? subscription.plan
    : 'FREE';
}

export function dailyMessageLimit(plan: SubscriptionPlan) {
  const configured = Number(process.env[`CHAT_DAILY_LIMIT_${plan}`]);
  return Number.isInteger(configured) && configured > 0 ? configured : fallbackLimits[plan];
}

export function utcDayWindow(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const resetsAt = new Date(start);
  resetsAt.setUTCDate(resetsAt.getUTCDate() + 1);
  return { start, resetsAt };
}

export function estimatedCostMicros(inputTokens: number, outputTokens: number) {
  const inputRate = Number(process.env.OPENAI_INPUT_COST_PER_MILLION);
  const outputRate = Number(process.env.OPENAI_OUTPUT_COST_PER_MILLION);
  if (!Number.isFinite(inputRate) || !Number.isFinite(outputRate)) return null;

  return Math.max(0, Math.round(inputTokens * inputRate + outputTokens * outputRate));
}
