# Project Aphrodite — Architecture Audit Findings and Next-Sprint Recommendations

**Audit phase:** Repository inventory, architecture map, and dependency graph  
**Recommended sprint type:** Focused architecture cleanup  
**Current architecture score:** 8/10  
**Recommendation:** Continue with the existing modular-monolith architecture. Do not rewrite or split into microservices.

## Executive Summary

Project Aphrodite has a credible MVP architecture built around:

- One deployable Next.js application
- One PostgreSQL database
- Prisma as the persistence boundary
- Auth.js for authentication
- Small workspace packages for AI, database access, character-domain types, configuration, and UI primitives
- Optional integrations for OpenAI, Stripe, and ComfyUI/FLUX

This is the correct architecture for the product's current stage. The next sprint should not introduce a new framework, a separate API service, microservices, or a generic repository layer.

The highest-value architecture work is cleanup and boundary clarification:

1. Resolve the duplicate or stale authentication package.
2. Begin organizing new code by feature without performing a large migration.
3. Reduce future duplication around direct Prisma access through targeted feature services.
4. Bring architecture documentation back in sync with the implementation.
5. Improve repository and review-bundle hygiene.
6. Clarify environment-variable ownership for build-time and runtime configuration.

## Current Architecture

```text
Browser
   |
   v
Next.js App Router application
apps/web
   |
   +-- Public pages
   +-- Protected server-rendered pages
   +-- Server actions
   +-- Route handlers
   |
   +---- PostgreSQL through Prisma
   +---- OpenAI or development fallback
   +---- Stripe
   +---- ComfyUI / FLUX
```

### Workspace dependency direction

```text
@aphrodite/web
├── @aphrodite/ai
├── @aphrodite/auth
├── @aphrodite/database
├── @aphrodite/entity-dna
├── @aphrodite/ui
└── @aphrodite/config

@aphrodite/auth
└── @aphrodite/database
```

No declared circular workspace dependencies were identified.

## Strengths to Preserve

### 1. Appropriate modular-monolith design

The application remains simple to deploy, debug, and operate. This is preferable to splitting the system prematurely.

### 2. Server-oriented data access

Sensitive database and provider operations remain server-side.

### 3. AI logic is separated from the web framework

The AI package contains provider and relationship logic without depending on React, route handlers, or Prisma.

### 4. The database package provides a consistent Prisma entry point

The shared Prisma client avoids repeated client creation and standardizes imports.

### 5. External integrations are optional

The local-first application can operate without requiring all paid providers.

### 6. Dependency usage is restrained

The repository uses conventional, maintainable libraries rather than accumulating unnecessary abstractions.

### 7. Domain types are provider-neutral

The entity-DNA package can describe characters independently of a specific model provider.

## Findings and Recommended Changes

# Priority 1 — Resolve the authentication package inconsistency

## Finding

Authentication appears to be configured in two places:

- `packages/auth`
- `apps/web/auth.ts`

The shared package appears unused or only partially used. It also references a `/sign-in` route while the application uses `/login`.

This creates two possible sources of truth for:

- Session strategy
- Prisma adapter configuration
- Login routes
- Providers
- Callbacks
- Authorization behavior

## Recommended decision

Choose one of these approaches during the sprint:

### Preferred option for the current stage

Keep the runtime Auth.js configuration in `apps/web/auth.ts` and remove `@aphrodite/auth` until another deployable application genuinely needs shared authentication.

This avoids maintaining a premature abstraction.

### Alternative

Move only genuinely shared configuration into `packages/auth`, then make `apps/web/auth.ts` compose and extend that shared configuration.

Do not keep two independent full configurations.

## Acceptance criteria

- There is one clear source of truth for Auth.js configuration.
- `/login` and all auth redirects are consistent.
- No unused `@aphrodite/auth` dependency remains.
- `pnpm typecheck`, `pnpm lint`, tests, and production build pass.
- Sign-up, sign-in, sign-out, protected-route redirects, and session loading are manually verified.

# Priority 2 — Introduce feature-oriented organization incrementally

## Finding

`apps/web` currently owns routing, auth, chat, billing, creator tools, image generation, profile handling, and data access.

That is acceptable now, but continued growth could scatter each feature across:

- Route handlers
- Server actions
- Components
- Database queries
- Validation schemas
- Helpers

## Recommendation

Do not reorganize the whole application.

Instead, require the next substantial feature to use a feature-oriented structure such as:

```text
apps/web/features/
├── billing/
├── chat/
├── creator/
├── memories/
├── profiles/
└── relationships/
```

A feature directory may contain:

```text
feature-name/
├── actions.ts
├── queries.ts
├── schemas.ts
├── service.ts
├── types.ts
└── components/
```

Only create files that are needed. Do not produce empty architecture placeholders.

## Acceptance criteria

- At least one actively modified feature is organized under `apps/web/features`.
- New feature business rules are not duplicated between route handlers and server actions.
- No large mechanical move of unrelated files occurs.
- Existing route structure remains stable.

# Priority 3 — Contain direct Prisma access where business rules repeat

## Finding

The database package is imported throughout the web application. Direct Prisma access is currently manageable, but ownership rules and multi-step business behavior may eventually be duplicated.

## Recommendation

Do not add a generic repository abstraction.

Create focused feature-level query or service modules only when one of these conditions exists:

- The same query is used in multiple places.
- Authorization ownership checks repeat.
- Multiple writes must occur transactionally.
- Relationship, memory, subscription, or conversation invariants must be enforced consistently.

Example:

```text
apps/web/features/conversations/
├── queries.ts
├── service.ts
└── schemas.ts
```

Potential service responsibilities:

- Load a conversation owned by the active user.
- Create or reuse a conversation safely.
- Append a message and update related state transactionally.
- Return only data the caller is authorized to access.

## Acceptance criteria

- No generic `BaseRepository` or broad data-access framework is introduced.
- Repeated ownership-sensitive logic is centralized where discovered.
- Prisma transactions are used for multi-write invariants where necessary.
- Route handlers remain thin orchestration boundaries.

# Priority 4 — Update architecture documentation

## Finding

Several documents describe implemented capabilities as future work. Examples include:

- AI chat described as planned
- The live AI layer described as inactive
- The monorepo tree omitting `packages/entity-dna`
- Authentication routes referring to `/sign-in` instead of `/login`

## Recommendation

Update the documentation to distinguish clearly between:

- Implemented and verified
- Implemented but provider-dependent
- Development fallback behavior
- Planned work

Suggested documents to review:

```text
README.md
docs/01-ARCHITECTURE.md
docs/02-TECH-STACK.md
docs/
```

## Acceptance criteria

- Architecture diagrams match the repository.
- Current and planned functionality are clearly separated.
- Local fallback behavior is documented honestly.
- Environment-variable documentation matches `.env.example`.
- No document claims real OpenAI or Stripe behavior works without credentials.

# Priority 5 — Improve repository and review-bundle hygiene

## Finding

The review archive contained generated or machine-local material such as:

- `.pnpm-store`
- `.tsbuildinfo`
- `.agent-cache`

These files make archives larger and can create confusion about what is source-controlled.

## Recommendation

Verify `.gitignore` and add a reusable archive script that excludes:

```text
.git
node_modules
.next
.pnpm-store
.agent-cache
*.tsbuildinfo
coverage
dist
.env
.env.*
```

Preserve `.env.example`.

Example archive command:

```bash
zip -r ProjectAphrodite-review.zip . \
  -x '.git/*' \
     'node_modules/*' \
     '*/node_modules/*' \
     '.next/*' \
     '*/.next/*' \
     '.pnpm-store/*' \
     '.agent-cache/*' \
     '*.tsbuildinfo' \
     'coverage/*' \
     '*/coverage/*' \
     'dist/*' \
     '*/dist/*' \
     '.env' \
     '.env.*' \
     '!.env.example'
```

## Acceptance criteria

- `git status --ignored` confirms generated files are ignored.
- A clean review archive can be produced from one documented command or script.
- Secrets and `.env` files are never included.
- `.env.example` remains included.

# Priority 6 — Clarify build-time and runtime environment variables

## Finding

Turbo currently declares only a limited environment set, while the application also supports AI, Stripe, and ComfyUI configuration.

Not every runtime secret belongs in the Turbo build cache key, but the current distinction should be documented and intentional.

## Recommendation

Classify variables into:

### Build-sensitive

Variables that can affect static generation, build validation, or compiled output.

### Runtime-only

Secrets and endpoints read only by server requests during execution.

Review:

- `turbo.json`
- `vercel.json`
- `.env.example`
- Environment validation code
- Deployment documentation

## Acceptance criteria

- Every environment variable is classified as build-sensitive or runtime-only.
- Turbo cache configuration includes only values that actually affect build output.
- Production startup fails clearly when a required production variable is missing.
- Optional integrations remain optional in local development.
- No secret is exposed through a `NEXT_PUBLIC_` name unless intentionally client-visible.

## Suggested Sprint Scope

### Sprint title

**Architecture Cleanup and Boundary Hardening**

### Sprint objective

Remove stale abstractions, clarify ownership boundaries, align documentation with reality, and make the repository easier to extend without changing the product architecture.

### In scope

- Resolve `packages/auth` versus `apps/web/auth.ts`
- Correct auth route inconsistencies
- Introduce one feature-oriented module where current work naturally fits
- Centralize repeated ownership-sensitive Prisma logic discovered during the change
- Update architecture and tech-stack documentation
- Improve `.gitignore` and review-archive tooling
- Audit Turbo and deployment environment declarations
- Run the full validation suite

### Out of scope

- Microservices
- Separate NestJS or Express API
- Database replacement
- ORM replacement
- Full repository reorganization
- Generic repository pattern
- New product modules
- UI redesign
- Real OpenAI or Stripe activation unless credentials are already available
- Large formatting-only changes

## Recommended Execution Order

1. Inspect all auth imports and runtime entry points.
2. Decide whether to remove or properly compose `packages/auth`.
3. Fix route naming and redirect consistency.
4. Identify one repeated ownership-sensitive query flow.
5. Move that flow into a focused feature module.
6. Update architecture documentation.
7. Add repository archive tooling.
8. Review environment-variable classification.
9. Run all validation.
10. Manually smoke-test authentication and the modified feature.
11. Commit as one focused architecture-cleanup milestone.

## Validation Checklist

Run from the repository root:

```bash
pnpm install
pnpm db:generate
DATABASE_URL="$DATABASE_URL" pnpm db:validate
pnpm typecheck
pnpm lint
pnpm test
DATABASE_URL="$DATABASE_URL" \
AUTH_SECRET="$AUTH_SECRET" \
NEXTAUTH_URL="$NEXTAUTH_URL" \
AI_PROVIDER="${AI_PROVIDER:-mock}" \
pnpm build
git diff --check
docker compose -f docker/compose.yml config
git status
```

Also manually verify:

- Sign-up
- Sign-in
- Sign-out
- Protected-route redirect
- Session persistence after refresh
- Profile access
- The feature whose data-access logic was moved
- Local development fallback behavior

## Definition of Done

The sprint is complete when:

- Authentication has one source of truth.
- Route naming is consistent.
- No unused auth package or dependency remains.
- At least one feature uses a clear feature-oriented boundary.
- Repeated ownership-sensitive Prisma logic touched by the sprint is centralized.
- Architecture documentation reflects current behavior.
- Generated files and secrets are excluded from review archives.
- Environment-variable classification is documented.
- Typecheck, lint, tests, build, Prisma validation, Docker Compose validation, and `git diff --check` pass.
- The working tree is clean after a focused local commit.

## Expected Outcome

After this sprint, Project Aphrodite should retain the same user-facing capability while gaining:

- A clearer authentication boundary
- Less architectural ambiguity
- Safer future feature growth
- Better documentation
- Cleaner repository handoffs
- More predictable deployment configuration

This is a cleanup and risk-reduction sprint, not a rewrite.
