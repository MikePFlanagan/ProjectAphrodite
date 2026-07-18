# Technology Stack

## Core Stack

| Layer            | Technology     | Purpose                                      |
| ---------------- | -------------- | -------------------------------------------- |
| Web framework    | Next.js 16     | App Router, server rendering, route handlers |
| UI library       | React 19       | Component-based user interface               |
| Language         | TypeScript     | Static typing and safer refactoring          |
| Styling          | Tailwind CSS 4 | Rapid, consistent interface development      |
| Authentication   | Auth.js 5      | Sessions and credentials authentication      |
| ORM              | Prisma 6       | Type-safe database access and migrations     |
| Database         | PostgreSQL 17  | Relational application storage               |
| Package manager  | pnpm           | Fast workspace dependency management         |
| Monorepo tooling | Turborepo      | Coordinated builds, linting, and type checks |
| Validation       | Zod            | Server and client input validation           |
| Icons            | Lucide React   | Consistent icon system                       |
| Animation        | Framer Motion  | Marketing and interface animation            |
| Containers       | Docker Compose | Local PostgreSQL development                 |
| CI               | GitHub Actions | Automated project validation                 |

## Next.js

Next.js was selected because it provides:

- App Router
- Server Components
- Server-side rendering
- Static generation
- Route handlers
- Middleware and authentication integration
- Strong Vercel deployment support
- Mature React ecosystem

## TypeScript

TypeScript is required across the codebase.

Benefits include:

- Typed database records
- Safer component props
- Better editor tooling
- Refactoring confidence
- Reduced runtime errors
- Shared types between packages

Avoid unnecessary `any` usage.

## Tailwind CSS

Tailwind CSS supports rapid visual iteration while keeping design values consistent.

The project currently uses:

- Near-black backgrounds
- Fuchsia and violet accents
- Semi-transparent surfaces
- Soft borders
- Large rounded cards
- Backdrop blur
- Subtle glow effects

Repeated style patterns should gradually become shared UI components.

## Prisma

Prisma provides:

- Schema-driven database design
- Generated TypeScript client
- Database migrations
- Relational queries
- Development seed scripts
- Prisma Studio

## PostgreSQL

PostgreSQL was selected because it provides:

- Reliable relational storage
- Strong constraints
- Transactions
- Mature indexing
- JSON support when needed
- Broad hosting support
- A clear path from local development to production

The local development database runs through Docker Compose.

## Auth.js

Auth.js currently provides:

- Credentials login
- Session management
- Prisma adapter support
- Protected route integration
- User session access

Future additions may include:

- Google sign-in
- Email verification
- Password reset
- Account recovery
- Optional multi-factor authentication

## Turborepo

Turborepo coordinates commands across workspace packages.

Current tasks include:

- Development
- Build
- Type checking
- Linting

The root lint configuration still requires additional work for shared packages whose source files are currently ignored by ESLint.

## pnpm

pnpm was selected for:

- Efficient disk usage
- Fast installs
- Workspace support
- Strict dependency isolation
- Reliable monorepo management

Commands should generally be run from the repository root.

## Docker Compose

Docker Compose provides a repeatable local PostgreSQL environment.

Current local mapping:

```text
Host port: 5433
Container port: 5432
```

Port 5433 is used because port 5432 was unavailable on the development machine.

## Planned AI Stack

The live AI layer is not yet active.

The planned implementation includes:

- Vercel AI SDK
- Provider abstraction
- Streaming text responses
- Character-specific system prompts
- Conversation context
- Usage tracking
- Moderation controls
- Character-scoped durable memory retrieval
- Rolling conversation summaries

The initial implementation should use one provider before introducing multi-provider complexity.

## Payments Stack

Stripe provides:

- Checkout
- Recurring subscriptions
- Billing portal
- Webhook processing
- Subscription status synchronization

Incoming lifecycle events are verified against the raw request body before subscription state is
synchronized. Paid authorization is derived from persisted, webhook-confirmed state.
