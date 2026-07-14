# Project Structure

## Repository Overview

```text
ProjectAphrodite/
├── apps/
│   └── web/
├── packages/
│   ├── ai/
│   ├── auth/
│   ├── config/
│   ├── database/
│   └── ui/
├── prisma/
├── docker/
├── docs/
├── .github/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## `apps/web`

The production Next.js application.

```text
apps/web/
├── app/
├── components/
├── lib/
├── types/
├── auth.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

### `apps/web/app`

Contains Next.js App Router routes and layouts.

Important route groups include:

```text
app/
├── (protected)/
├── api/
├── login/
├── signup/
├── layout.tsx
└── page.tsx
```

The `(protected)` route group contains authenticated application pages.

### `apps/web/components`

Contains current shared application components.

```text
components/
├── auth/
├── characters/
├── dashboard/
├── layout/
└── marketing/
```

### `apps/web/lib`

Contains server helpers and application utilities.

Examples include:

- Authentication helpers
- Environment validation
- Database-related helpers
- Server-side validation utilities

### `apps/web/types`

Contains application-specific TypeScript declarations.

## `packages/ai`

Reserved for shared AI functionality.

Planned responsibilities:

- AI provider clients
- Character prompt construction
- Streaming helpers
- Usage accounting
- Moderation integration
- Memory retrieval

The package should not contain UI components.

## `packages/auth`

Reserved for shared authentication functionality and types.

The web application currently also contains its Auth.js configuration in `apps/web/auth.ts`.

Shared logic may move into this package only when reuse justifies it.

## `packages/config`

Contains shared configuration and project-level defaults.

## `packages/database`

Contains the shared Prisma client and database package scripts.

Responsibilities:

- Prisma client singleton
- Database exports
- Generate command
- Migration command
- Seed command
- Prisma Studio command

## `packages/ui`

Reserved for reusable visual primitives shared across applications.

Future examples:

- Button
- Card
- Input
- Badge
- Avatar
- Dialog
- Dropdown
- Empty state
- Skeleton
- Spinner
- Tooltip

Only broadly reusable, application-independent components belong here.

## `prisma`

```text
prisma/
├── migrations/
├── schema.prisma
└── seed.ts
```

### `schema.prisma`

Defines database models, enums, relations, and constraints.

### `migrations`

Contains committed database migration history.

Migrations should not be edited after being applied to shared environments.

### `seed.ts`

Creates original demo character records for development.

## `docker`

Contains local infrastructure configuration.

```text
docker/
└── compose.yml
```

The current Compose file starts PostgreSQL for local development.

## `docs`

Contains living product and engineering documentation.

Documentation must distinguish between:

- Current behavior
- Planned behavior
- Known limitations

## `.github`

Contains GitHub Actions and future repository templates.

Potential additions:

- Pull request template
- Issue templates
- Security policy
- Dependabot configuration

## Future Feature-Based Structure

As the application grows, feature-specific code should move toward:

```text
apps/web/features/
├── auth/
├── billing/
├── characters/
├── chat/
├── creator/
├── dashboard/
├── favorites/
└── settings/
```

A feature folder may contain:

```text
feature/
├── components/
├── actions/
├── queries/
├── schemas/
├── types/
└── utils/
```

This migration should happen gradually. Working code should not be moved only for cosmetic reasons.

## File Placement Rules

- Route files belong in `app`.
- Reusable application components belong in `components`.
- Feature-specific components belong near their feature.
- Shared visual primitives belong in `packages/ui`.
- Database schema and migrations belong in `prisma`.
- Shared Prisma client code belongs in `packages/database`.
- Secrets belong only in ignored environment files.
- Product and engineering documentation belongs in `docs`.
