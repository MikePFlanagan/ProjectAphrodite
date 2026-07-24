# Project Aphrodite — Stripe, Deployment, and Production Readiness Review

**Review status:** Complete  
**Area score:** 6.5/10  
**Current recommendation:** Do not perform a broad public paid launch yet. A controlled private alpha is reasonable after the critical items are completed.

## Executive Summary

Stripe integration uses the correct fundamental components:

- Official Stripe SDK
- Server-created Checkout sessions
- Billing Portal sessions
- Signed webhook verification
- Subscription metadata linking Stripe objects to application users
- Database synchronization through upsert
- Plan fallback to free when subscription is inactive

Deployment configuration is simple and understandable, but production readiness is incomplete:

- Local ComfyUI cannot be reached from Vercel.
- CI does not run tests or migrations.
- Webhook event ordering/idempotency is not tracked.
- Security headers and operational monitoring are missing.
- Database backups, restore testing, secret rotation, and incident procedures are undocumented.
- Health checking is minimal.
- The production data-retention and moderation story is incomplete.

## Stripe Findings

### Strength — Checkout and Portal are created server-side

Sensitive Stripe operations are not delegated to the browser.

### Strength — Webhook signatures are verified

The route uses the raw request body and Stripe's official `constructEvent()` verification.

### High Priority — Persist webhook events for idempotency and ordering

Subscription upserts are mostly repeat-safe, but the application does not store processed event IDs or event creation times.

Risks:

- Duplicate webhook processing
- Older events arriving after newer events and regressing subscription state
- Difficult operational reconciliation

**Recommended change:** Add a `StripeWebhookEvent` table with:

- Stripe event ID unique key
- Type
- Created timestamp
- Processing status
- Attempt count
- Last error
- Processed timestamp

Ignore already-completed events and reject stale state transitions when appropriate.

### Medium Priority — Add Checkout idempotency

Repeated requests can create multiple Checkout sessions.

**Recommended change:** Use Stripe idempotency keys derived from user, price, and a bounded request window or a server-generated checkout-attempt record.

### Medium Priority — Tighten CSRF/origin handling

`isTrustedBillingRequest()` accepts a missing `Origin`.

**Recommended change:** Require same-origin requests for browser-initiated billing actions and use a CSRF strategy compatible with server actions/routes.

### Medium Priority — Separate billing configuration checks

`isBillingConfigured()` requires the webhook secret even for starting Checkout. This is safe but couples independent operations.

**Recommended change:** Define configuration checks by capability:

- Checkout configured
- Portal configured
- Webhook configured

Production startup should still fail if billing is advertised as enabled but webhook processing is unavailable.

### Medium Priority — Reconcile subscription state periodically

Webhooks can fail despite retries.

**Recommended change:** Add an admin reconciliation command that compares local subscription records with Stripe.

### Medium Priority — Test status transitions

Add tests for:

- Trialing
- Active
- Past due
- Unpaid
- Paused
- Canceled
- Incomplete
- Price mismatch
- Deleted subscription
- Out-of-order events

## Deployment Findings

### Critical — Hosted web and local ComfyUI are incompatible

A Vercel deployment cannot call ComfyUI on a user's Mac through `127.0.0.1`.

**Recommended change:** Deploy a secured worker/provider before claiming hosted generation support.

### High Priority — CI does not run tests

The workflow runs formatting, lint, typecheck, and build, but not `pnpm test`.

**Recommended change:** Add tests as a required CI step.

### High Priority — CI does not validate real migrations

The workflow defines a database URL but does not launch PostgreSQL or run migrations.

**Recommended change:** Add a PostgreSQL service and run:

```bash
pnpm db:generate
pnpm db:validate
pnpm db:migrate
pnpm test
```

### High Priority — Add deployment migration strategy

The Vercel build command generates Prisma but does not deploy migrations.

**Recommended change:** Run migrations as a controlled release step, not concurrently in every serverless build. Document rollback and forward-fix procedures.

### Medium Priority — Bind local PostgreSQL to localhost

Docker exposes port 5433 on all interfaces by default.

**Recommended change:**

```yaml
ports:
  - "127.0.0.1:5433:5432"
```

Use non-default credentials where the environment is shared.

### High Priority — Add security headers

Add an intentional policy for:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Frame ancestors / clickjacking protection

Test compatibility with Auth.js, Stripe, and image delivery.

### High Priority — Add observability

Production needs:

- Error tracking
- Structured logs
- Request IDs
- Provider latency and failure metrics
- Chat and generation usage metrics
- Webhook processing dashboard
- Database connection monitoring
- Alerting thresholds

### High Priority — Define backups and restore tests

A production database requires automated backups and periodic restoration drills.

### Medium Priority — Improve health checks

The main health route only performs `SELECT 1`.

**Recommended change:** Separate:

- Liveness
- Readiness
- Dependency diagnostics

Do not expose sensitive configuration publicly.

### Medium Priority — Add request-body and platform limits

Explicitly configure body sizes, upload limits, execution timeouts, and provider timeouts.

### Medium Priority — Clarify environment validation

The environment schema validates core values, but optional integrations can remain partially configured.

**Recommended change:** Add cross-field validation:

- `AI_PROVIDER=openai` requires API key and model policy.
- Billing-enabled mode requires all required Stripe values.
- Hosted generation mode requires a non-local reachable worker endpoint.
- Production must not silently use mock providers unless explicitly allowed.

## Broader Production Readiness

Before public launch, define:

- Terms and privacy policy matching actual data practices
- Account deletion and data export
- Memory deletion semantics
- Image and conversation retention periods
- Moderation and abuse reporting
- Age policy
- AI disclosure
- Incident response
- Support channel
- Dependency and secret rotation process
- Cost ceilings and provider shutdown controls

## Suggested Sprint

### Sprint title

**Paid Alpha Production Hardening**

### In scope

- Stripe webhook event ledger and ordering protection
- Checkout idempotency
- CSRF/origin hardening
- Stripe transition tests
- PostgreSQL-backed CI migration tests
- Required `pnpm test` CI step
- Production migration runbook
- Security headers
- Structured logging and error tracking
- Backup and restore plan
- Production environment cross-validation
- Localhost-only Docker database binding
- Hosted image-worker decision and configuration

### Out of scope

- Multi-region deployment
- Enterprise billing
- Multiple currencies
- Native mobile deployment
- Autoscaling GPU fleet
- Large analytics platform

## Acceptance Criteria

- Duplicate and out-of-order Stripe events cannot corrupt entitlement state.
- Checkout requests are idempotent.
- Billing mutations require trusted same-origin intent.
- CI runs tests and real migrations against PostgreSQL.
- Production releases have a documented migration process.
- Security headers pass automated inspection.
- Production cannot silently use mock AI or localhost ComfyUI.
- Errors and webhook failures are observable.
- Database backup and restore procedures are tested.
- All production secrets are documented, scoped, and rotatable.
- A rollback or forward-fix plan exists.

## Launch Recommendation

### Private local development

**Yes**

### Small invited alpha without paid billing

**Yes, after auth abuse controls and image-upload validation**

### Paid invited alpha

**Yes, after this sprint and Stripe test-mode end-to-end verification**

### Broad public launch

**Not yet**

## Definition of Done

This area is complete when billing state is idempotent and reconcilable, CI validates the true release path, production configuration cannot silently fall back to development behavior, operational failures are visible, and the hosted image architecture is real rather than dependent on a developer laptop.
