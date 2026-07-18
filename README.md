# Project Aphrodite

Original AI companion SaaS platform with a public marketing page, credential authentication, protected character browsing, saved starter conversations, and safe demo data. Live AI generation and billing remain intentionally out of scope.

## Architecture

- `apps/web` — Next.js 16 App Router application. It is the only deployable application and owns route handlers, environment validation, and product composition.
- `packages/ui` — shared React components designed as the import target for shadcn/ui primitives and product UI.
- `packages/database` — Prisma client singleton and database commands. The schema stays at the required root `prisma/` location.
- `packages/ai` — provider-neutral Vercel AI SDK contracts and validated companion-message inputs. Provider selection belongs in the web app, so credentials never cross package boundaries.
- `packages/auth` — shared Auth.js/Prisma adapter boundary; the web app owns the credentials provider and server-side authorization helpers.
- `packages/config` — shared TypeScript base configuration.
- `docker` — local PostgreSQL service only.

The Prisma schema includes Auth.js models, users/roles, published characters, conversations/messages, favorites, memories, and subscription state. Character/demo imagery uses CSS gradients only.

## Local setup

Prerequisites: Node.js 22+, pnpm 10+, Docker Desktop.

```sh
cd ProjectAphrodite
cp .env.example .env
docker compose -f docker/compose.yml up -d
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm --filter @aphrodite/web dev:3002
```

The web application will be available at `http://localhost:3002`.

Quality and production commands:

```sh
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm db:validate
pnpm db:studio
```

## Environment variables

Required for local database and Auth.js startup:

- `DATABASE_URL`
- `AUTH_SECRET` — generate a high-entropy secret for every deployed environment.
- `NEXTAUTH_URL` — public application origin, such as `http://localhost:3002`.

Required when enabling AI generation:

- `OPENAI_API_KEY` — server-only; do not expose with a `NEXT_PUBLIC_` prefix.
- `OPENAI_MODEL` — defaults to `gpt-5-mini`.
- `CHAT_DAILY_LIMIT_FREE`, `CHAT_DAILY_LIMIT_PREMIUM`, and `CHAT_DAILY_LIMIT_CREATOR` — optional UTC daily message allowances.
- `OPENAI_INPUT_COST_PER_MILLION` and `OPENAI_OUTPUT_COST_PER_MILLION` — optional USD rates used to estimate per-response cost telemetry.

Required when billing routes are implemented:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Current application routes

- Public: `/`, `/login`, `/signup`
- Protected: `/dashboard`, `/explore`, `/favorites`, `/settings`, `/characters/[slug]`, and `/chat/[conversationId]`

Character and conversation access is enforced in server components/actions; URL changes cannot expose another member's conversation. Live chat streams character-specific responses, persists both sides of the conversation, enforces plan-aware daily limits, and records token usage per conversation.

## Deliberate next steps

Add email/OAuth providers, deeper safety controls, conversation-memory extraction, and Stripe checkout/webhooks. Keep those features behind server-side authorization and audit logging.
