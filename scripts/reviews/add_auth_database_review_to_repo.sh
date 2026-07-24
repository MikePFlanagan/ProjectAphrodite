#!/usr/bin/env bash
set -euo pipefail

DOC_PATH="docs/07-AUTH-AUTHORIZATION-DATABASE-REVIEW.md"

if [[ ! -f "pnpm-workspace.yaml" ]] || [[ ! -d "apps/web" ]]; then
  echo "Error: run this script from the ProjectAphrodite repository root." >&2
  exit 1
fi

mkdir -p "$(dirname "$DOC_PATH")"

cat > "$DOC_PATH" <<'MARKDOWN'
# Project Aphrodite — Authentication, Authorization, Prisma, and Database Review

**Review status:** Complete  
**Area score:** 7.5/10  
**Ship status for this area:** Suitable for continued MVP development, but complete the high-priority hardening items before public production.

## Executive Summary

Authentication and data ownership are generally implemented with good instincts:

- Auth.js credentials authentication is server-side.
- Passwords are hashed with bcrypt using cost 12.
- Protected pages use a centralized `requireUser()` helper.
- Most database reads and writes scope records to the authenticated user.
- Prisma relations use cascading deletion appropriately.
- Unique constraints protect important domain invariants.

The largest issues are not basic authentication failures. They are consistency, concurrency, and production-hardening problems:

1. Two conflicting authentication configurations exist.
2. JWT sessions can retain stale role or profile data.
3. There is no visible login/signup abuse protection.
4. Some ownership rules exist only in application code rather than database-enforceable structure.
5. Relationship and usage updates can race under concurrent requests.
6. The schema stores large base64 reference images directly in PostgreSQL.
7. CI does not validate migrations against a real PostgreSQL service.

## Findings

### High Priority — Remove the duplicate Auth.js configuration

The active application config is `apps/web/auth.ts`. A second config exists in `packages/auth/src/index.ts`.

They disagree on:

- Login route: `/login` versus `/sign-in`
- Session strategy: JWT versus database sessions
- Providers: credentials provider versus none

This creates a dangerous maintenance trap.

**Recommended change:** Keep `apps/web/auth.ts` as the only runtime source of truth for now and remove the unused package and dependency. Reintroduce a shared auth package only when a second application actually consumes it.

### High Priority — Add authentication abuse controls

The credentials flow performs password hashing and comparison correctly, but no rate limiting, progressive delay, lockout, bot protection, or signup throttling is visible.

Risks include:

- Credential stuffing
- Password guessing
- Automated account creation
- Database and CPU pressure from bcrypt attempts

**Recommended change:** Add per-IP and per-account throttling using a production-capable shared store. Return generic login errors and log security events without storing passwords or raw credentials.

### Medium Priority — JWT claims can become stale

The JWT callback stores `id` and `role` when the user signs in. Later database changes to role, name, image, account suspension, or deletion will not automatically refresh that JWT.

**Recommended change:** Define a deliberate session refresh policy. At minimum, re-query security-sensitive account state periodically or whenever authorization depends on role. Add an `isDisabled` or account-status field before admin/creator privileges become meaningful.

### Medium Priority — Formalize authorization helpers

Ownership checks are mostly correct but repeated through ad hoc Prisma clauses such as:

```ts
where: { id, userId: session.user.id }
```

**Recommended change:** Add focused helpers for ownership-sensitive resources:

- `requireOwnedConversation`
- `requireOwnedDraft`
- `requireOwnedCreatorAsset`
- `requireOwnedMemory`

Do not create a generic repository framework.

### High Priority — Fix concurrency races

The chat daily limit is enforced by:

1. Counting existing messages.
2. Comparing with the limit.
3. Creating a new message later.

Concurrent requests can both pass the count and exceed the plan limit.

Relationship state is also loaded, calculated in application code, then written as absolute values. Concurrent messages can overwrite one another and lose score changes.

**Recommended change:**

- Use a transactional usage counter or database-backed quota row.
- Use atomic increments for relationship deltas where possible.
- Apply clamping safely in a transaction or serialized domain operation.
- Add concurrency tests.

### Medium Priority — Strengthen relational ownership guarantees

`CreatorReference` stores both `userId` and `characterId`, but the database cannot guarantee that the referenced character belongs to the same user. Application checks currently preserve this invariant.

**Recommended change:** Either remove redundant ownership columns where they can be derived, or introduce a database-enforceable composite ownership relation if the redundancy is necessary for querying.

### High Priority — Move reference image bytes out of PostgreSQL

`CreatorReference.dataUrl` stores full base64 images in a `TEXT` column.

Problems:

- Base64 adds roughly one-third storage overhead.
- Database backups grow quickly.
- Reads return large payloads.
- The declared `sizeBytes` is trusted separately from the actual data.
- The schema validates the data URL prefix but does not impose a strict encoded-string maximum.

**Recommended change:** Store reference images in object storage or a controlled local file store. Persist only:

- Storage key
- MIME type
- Verified byte size
- Hash
- Dimensions
- Ownership metadata

Until storage is migrated, decode and verify the actual payload server-side and impose a strict request-body limit.

### Medium Priority — Email normalization should be database-safe

Application code lowercases email before lookup and creation. The database uses a normal unique string field.

**Recommended change:** Preserve normalization in application code and consider PostgreSQL `citext` or a normalized-email column if multiple identity providers are introduced.

### Medium Priority — Add explicit constraints for score ranges

Relationship values are logically bounded from 0 to 100, but Prisma does not express database check constraints in the schema.

**Recommended change:** Add SQL check constraints in a migration for all relationship dimensions and other bounded integer fields where corruption would matter.

### Medium Priority — Improve migration validation

Migrations are committed and structured, which is good. However, CI does not launch PostgreSQL or run deployment migrations.

**Recommended change:** CI should:

1. Start PostgreSQL.
2. Run `prisma migrate deploy`.
3. Run `prisma validate`.
4. Seed when relevant.
5. Run database integration tests.

### Low Priority — Remove unused Auth.js tables if the strategy remains JWT-only

The schema includes `Session` and `VerificationToken`, which may be useful for future providers but are not needed by the current credentials/JWT implementation.

**Recommended change:** Do not remove them immediately if OAuth or email verification is near-term. Otherwise document why they remain.

## Suggested Sprint

### Sprint title

**Identity and Data Boundary Hardening**

### In scope

- Remove or correctly compose the stale auth package
- Add login and signup throttling
- Establish account-status and role-refresh behavior
- Centralize repeated ownership checks
- Make chat quota and relationship updates concurrency-safe
- Validate reference-image bytes and begin storage migration
- Add database check constraints
- Run migrations in CI against PostgreSQL
- Add authorization and concurrency tests

### Out of scope

- OAuth providers
- Multi-factor authentication
- Full RBAC platform
- Generic repository layer
- Database replacement
- Microservices

## Acceptance Criteria

- One Auth.js configuration remains.
- Login route naming is consistent.
- Repeated failed authentication attempts are throttled.
- Disabled or role-changed accounts do not retain indefinite authorization.
- Cross-user access tests cover conversations, memories, creator drafts, assets, references, and billing.
- Concurrent chat requests cannot bypass plan limits.
- Concurrent relationship changes do not lose updates.
- Reference uploads verify actual bytes and enforce a hard server limit.
- Relationship score check constraints exist.
- CI runs Prisma migrations against PostgreSQL.
- Lint, typecheck, tests, build, and migration validation pass.

## Validation Commands

```bash
pnpm install --frozen-lockfile
docker compose -f docker/compose.yml up -d postgres
pnpm db:generate
pnpm db:validate
pnpm db:migrate
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
docker compose -f docker/compose.yml down
```

## Definition of Done

This area is complete when authentication has one source of truth, abuse controls are active, ownership boundaries are tested, concurrent writes preserve limits and relationship state, reference-image storage cannot be abused to inflate the database, and CI validates the real migration path.

MARKDOWN

echo "Created $DOC_PATH"
echo
echo "Reviewing generated file..."
git diff -- "$DOC_PATH" || true

echo
read -r -p "Stage the new review document with git? [y/N] " answer
case "${answer:-N}" in
  y|Y|yes|YES)
    git add "$DOC_PATH"
    echo "Staged $DOC_PATH"
    ;;
  *)
    echo "File was created but not staged."
    ;;
esac

echo
echo "Current git status:"
git status --short
