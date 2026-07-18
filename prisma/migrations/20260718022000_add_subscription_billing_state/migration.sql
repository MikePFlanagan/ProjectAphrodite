ALTER TABLE "Subscription"
ADD COLUMN "stripePriceId" TEXT,
ADD COLUMN "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;
