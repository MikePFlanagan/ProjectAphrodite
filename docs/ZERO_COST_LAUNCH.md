# Zero-upfront-cost launch

Project Aphrodite can be launched on free tiers, but production AI requests and successful card
payments are usage-based services. No legitimate setup can guarantee those remain free at scale.

## Free-tier stack

- Vercel Hobby for the Next.js web application.
- Neon Free for PostgreSQL.
- Stripe for subscriptions. Stripe has no monthly platform fee; processing fees are deducted only
  when a payment succeeds.
- A custom domain is optional. Use the free Vercel domain until revenue justifies buying one.

## Required production configuration

Create a Vercel project from this repository and set the project root to the repository root. Add:

- `DATABASE_URL`: pooled Neon production connection string.
- `AUTH_SECRET`: unique production secret of at least 32 characters.
- `NEXTAUTH_URL`: exact public `https://` application URL.
- `OPENAI_API_KEY`: server-only provider key.
- `OPENAI_MODEL`: optional; defaults to `gpt-5-mini`.
- `STRIPE_SECRET_KEY`: Stripe live secret key.
- `STRIPE_WEBHOOK_SECRET`: signing secret for the production webhook.
- `STRIPE_PREMIUM_PRICE_ID`: recurring Premium price ID.

Keep preview and production databases separate. Never expose secret values with a `NEXT_PUBLIC_`
prefix.

## First deployment

1. Create the free Postgres database.
2. Set `DATABASE_URL` locally to the production database only for the migration command.
3. Run `pnpm db:generate` and `pnpm --filter @aphrodite/database exec prisma migrate deploy
--schema ../../prisma/schema.prisma`.
4. Import the GitHub repository into Vercel and add the required environment variables.
5. Deploy and verify `/api/health` returns `{"status":"ok"}`.
6. Test signup, login, character browsing, a conversation, creator draft persistence, and logout.

## Turn on revenue

1. In Stripe live mode, create a recurring $19/month Premium product and price.
2. Add the price ID and live secret key to production.
3. Register `https://YOUR_DOMAIN/api/billing/webhook` for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Add the webhook signing secret and redeploy.
5. Make one real checkout, confirm Premium access, open the billing portal, then cancel the test
   subscription.

Until all three Stripe values are configured, Aphrodite keeps the Free plan usable and hides the
checkout action instead of failing.

## Before inviting customers

- Replace the generic operator wording in the Privacy Policy and Terms with the legal business name
  and a monitored support contact.
- Review the policies with qualified counsel for the launch jurisdiction.
- Configure database backups and provider spending alerts.
- Set a conservative OpenAI project budget and keep daily chat limits enabled.
- Use Stripe Tax or obtain tax advice before selling in jurisdictions where registration is
  required.
