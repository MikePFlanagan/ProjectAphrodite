#!/usr/bin/env bash
set -euo pipefail

DOC_PATH="docs/11-FINAL-ENGINEERING-REPORT.md"

if [[ ! -f "pnpm-workspace.yaml" ]] || [[ ! -d "apps/web" ]]; then
  echo "Error: run this script from the ProjectAphrodite repository root." >&2
  exit 1
fi

mkdir -p "$(dirname "$DOC_PATH")"

cat > "$DOC_PATH" <<'MARKDOWN'
# Project Aphrodite — Independent Final Engineering Report

**Review status:** Complete  
**Repository reviewed:** ProjectAphrodite review archive  
**Review method:** Independent static source, schema, configuration, migration, API, provider, and documentation inspection  
**Overall engineering score:** 7.1/10

## Final Recommendation

**Continue building. Do not rewrite.**

Project Aphrodite has a credible MVP foundation and is substantially more than a visual prototype. Authentication, persisted conversations, memories, relationship state, creator drafts, local image generation, usage limits, subscription state, and deployment configuration are connected into a coherent modular monolith.

The project is suitable for:

- Continued local development
- Product demonstrations
- A tightly controlled invited alpha after targeted hardening

It is not yet ready for:

- Broad public traffic
- Unrestricted image generation
- A paid production launch without additional billing and operational controls
- Hosted FLUX generation using the current localhost ComfyUI design

## Scorecard

| Area | Score | Verdict |
|---|---:|---|
| Repository architecture | 8.0/10 | Strong MVP structure |
| Authentication and authorization | 7.5/10 | Good ownership discipline; needs abuse and consistency hardening |
| Prisma and database | 7.5/10 | Solid relational model; concurrency and binary-storage concerns |
| API routes | 7.0/10 | Functional and validated; inconsistent parsing and error contracts |
| Chat engine | 7.0/10 | Genuine end-to-end implementation; reliability work required |
| Relationship engine | 6.5/10 | Clean interface, intentionally simplistic behavior |
| FLUX / ComfyUI | 6.5/10 | Good local integration, not a hosted production architecture |
| Creator tools | 7.0/10 | Useful foundation; publishing and permission policy incomplete |
| Stripe | 7.0/10 | Correct primitives; idempotency and ordering controls needed |
| Deployment and operations | 6.0/10 | Basic deployment exists; production controls incomplete |
| Tests | 5.5/10 | Useful unit tests, insufficient integration and security coverage |
| Documentation | 7.0/10 | Meaningful documentation with some stale sections |

## Strongest Engineering Decisions

1. Keeping the application as a modular monolith
2. Using server-side Prisma access and explicit user ownership checks
3. Isolating AI and relationship logic in a package
4. Supporting a deterministic local development provider
5. Persisting conversations, memories, usage, relationships, and billing state
6. Using signed Stripe webhooks
7. Protecting generated images through an authenticated proxy
8. Committing a real Prisma migration history
9. Avoiding unnecessary dependency and framework bloat
10. Preserving interfaces that allow future engine replacement

## Critical Findings

### 1. Local ComfyUI cannot serve a hosted Vercel application

This is the clearest production blocker. A deployed server cannot access the user's Mac at `127.0.0.1`.

### 2. Creator reference uploads can inflate PostgreSQL

The server trusts declared size, does not strictly cap the encoded data URL, and stores base64 bytes in a text column.

### 3. Generated-image authorization can be forged

The asset API accepts a client-provided proxy URL. A user may be able to claim a guessed ComfyUI output by creating an asset record.

### 4. Chat quotas and relationship updates are race-prone

Concurrent chat requests can exceed limits or lose relationship updates.

### 5. Authentication configuration has two conflicting sources

The active web config and shared auth package disagree on route, providers, and session strategy.

### 6. Production CI does not run tests or real database migrations

The current workflow does not validate the full release path.

### 7. Stripe event idempotency and ordering are not persisted

Out-of-order or repeated webhook events need explicit protection.

## Highest-Priority Roadmap

### Sprint 1 — Identity and database boundary hardening

- Remove duplicate auth config
- Add auth throttling
- Add ownership integration tests
- Make quota and relationship writes concurrency-safe
- Verify actual uploaded image bytes
- Add database constraints
- Run migrations in CI

### Sprint 2 — Chat reliability and relationship beta

- Add idempotency keys
- Add generation-attempt state
- Standardize API parsing/errors
- Add structured logging
- Move relationship rules to data
- Add token budgeting
- Add layered safety controls

### Sprint 3 — Secure image job pipeline

- Add server-owned generation jobs
- Bind prompt IDs and outputs to users
- Add image quotas and concurrency limits
- Move images to durable storage
- Add timeouts/cancellation
- Define creator access and publishing policy

### Sprint 4 — Paid alpha production hardening

- Add Stripe event ledger
- Add Checkout idempotency
- Harden CSRF/origin validation
- Add security headers
- Add monitoring and alerting
- Document deployment migrations
- Test backup restoration
- Replace localhost generation with a reachable worker/provider

## Required Test Expansion

Current tests cover only a narrow portion of the system.

Add:

- Auth action tests
- Cross-user authorization tests
- API malformed-input tests
- Chat concurrency tests
- Chat retry and idempotency tests
- Provider failure tests
- Retention safety tests
- Memory forget/recreate tests
- Relationship rule table tests
- Generated-image ownership tests
- Oversized and forged upload tests
- Stripe event ordering and duplicate tests
- Migration integration tests
- Browser smoke tests for core workflows

## Security Posture

The application demonstrates good baseline awareness:

- Server-side secrets
- Auth checks
- Zod validation
- Signed webhooks
- Password hashing
- Ownership-scoped queries
- Prompt safety instructions

However, production security requires additional layers:

- Rate limiting
- CSRF discipline
- Security headers
- Structured audit logging
- Upload decoding and normalization
- Provider output ownership
- Moderation
- Account status enforcement
- Incident response
- Secret rotation
- Dependency scanning

## Data and Privacy Posture

The product stores highly personal conversation and memory data. Before launch, implement and document:

- Data export
- Account deletion
- Conversation deletion
- Memory deletion guarantees
- Retention periods
- Backup deletion limitations
- Model-provider data handling
- Image metadata stripping
- Sensitive-memory exclusions
- Administrative access policy

## Deployment Verdict

### Local demo

**Ship**

### Portfolio demonstration

**Ship**

### Invite-only free alpha

**Ship after critical upload, auth-throttling, and concurrency fixes**

### Invite-only paid alpha

**Ship after Stripe and production-hardening sprint**

### Broad public launch

**Do not ship yet**

## Technical Debt Classification

### Healthy deliberate shortcuts

- Regex relationship evaluator behind a clean interface
- Mock AI provider
- Direct Prisma access at current scale
- Single Next.js deployment
- Minimal UI package

### Debt that should be resolved soon

- Duplicate auth package
- Base64 database image storage
- Client-claimable generated image URLs
- Non-atomic chat limits and relationship writes
- Missing API-wide error convention
- Missing integration tests
- Stale documentation

### Debt that can wait

- Microservices
- Separate API application
- Generic repositories
- Multi-region deployment
- Multiple AI providers
- Sophisticated event architecture

## Final Engineering Judgment

Project Aphrodite is a legitimate, thoughtfully assembled early product. The architecture should be preserved. The next work should focus on hardening the existing end-to-end workflows rather than adding more modules.

The product's biggest risk is not that the codebase is fundamentally bad. The risk is moving into public paid usage before concurrency, image ownership, upload storage, Stripe event handling, and production operations are hardened.

**Final verdict: Continue. Freeze new feature expansion temporarily and complete the four hardening sprints in order.**

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
