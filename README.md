# Project Aphrodite

Project Aphrodite is a local-first AI companion application with authenticated accounts,
published characters, persistent conversations, deterministic relationship state, controllable
memory, creator tools, local FLUX image generation, and optional Stripe billing.

## Stack and prerequisites

- Node.js 22+
- pnpm 10.10+
- Docker Desktop
- Next.js 16, React 19, TypeScript, Tailwind CSS
- PostgreSQL 17, Prisma 6, Auth.js
- Optional: OpenAI for production chat, Stripe for billing
- Optional: ComfyUI with FLUX Schnell for local image generation

## Local installation

```sh
git clone <repository-url> ProjectAphrodite
cd ProjectAphrodite
cp .env.example .env
cp .env.example apps/web/.env.local
docker compose -f docker/compose.yml up -d
pnpm install
pnpm db:generate
pnpm --filter @aphrodite/database exec prisma migrate deploy --schema ../../prisma/schema.prisma
pnpm db:seed
pnpm --filter @aphrodite/web dev:3002
```

Open `http://localhost:3002`. The seed is safe to rerun and upserts the published development
characters.

## Environment

The canonical list is [.env.example](./.env.example).

- `DATABASE_URL` — PostgreSQL connection string.
- `AUTH_SECRET` — server-only Auth.js secret of at least 32 characters.
- `NEXTAUTH_URL` — canonical application origin; use `http://localhost:3002` locally.
- `AI_PROVIDER` — `mock` for the clearly labeled deterministic development responder or `openai`.
- `OPENAI_API_KEY` — required only for `AI_PROVIDER=openai`.
- `OPENAI_MODEL` — defaults to `gpt-5-mini`.
- `CHAT_DAILY_LIMIT_*` — optional UTC daily message limits.
- `COMFYUI_URL` — server-only ComfyUI origin, default `http://127.0.0.1:8188`.
- `FLUX_MODEL` — checkpoint filename visible to ComfyUI.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PRICE_ID` — required together to
  enable real billing.

Never prefix provider credentials with `NEXT_PUBLIC_` or commit populated environment files.

## Chat and relationship behavior

`AI_PROVIDER=mock` is a zero-cost development mode. Every response starts with
`[Development response]`; it is not presented as a real model response. Messages, usage, history,
ownership checks, daily limits, and deterministic relationship updates remain active.

Set `AI_PROVIDER=openai` and provide `OPENAI_API_KEY` for model responses. The server owns the
character prompt and provider key. Conversation reads and writes are always scoped to the
authenticated user.

## Local FLUX / ComfyUI

The implementation uses ComfyUI's HTTP API:

- health: `GET ${COMFYUI_URL}/system_stats`
- queue: `POST ${COMFYUI_URL}/prompt`
- status: `GET ${COMFYUI_URL}/history/{promptId}`
- image bytes: `GET ${COMFYUI_URL}/view?...`

The application endpoint is `POST /api/generate`. It accepts an authenticated, validated JSON
request containing `prompt`, `width`, `height`, and optional generation settings. A successful
response contains a protected application URL, not an absolute machine path:

```json
{
  "success": true,
  "imageUrl": "/api/generated-image?filename=...&subfolder=&type=output",
  "promptId": "..."
}
```

Creator Studio saves that URL to an owner-scoped `CreatorAsset`. The image proxy verifies the
signed-in user owns the matching asset before requesting bytes from ComfyUI. Service details and
local filesystem paths never reach the browser.

For the currently discovered local installation:

```sh
/Users/home/Documents/ComfyUI/venv/bin/python \
  /Users/home/Documents/ComfyUI/main.py \
  --listen 127.0.0.1 \
  --port 8188
```

Place `flux1-schnell-fp8.safetensors` in ComfyUI's `models/checkpoints` directory, or set
`FLUX_MODEL` to another installed checkpoint name.

Health checks:

```sh
curl --fail http://127.0.0.1:8188/system_stats
curl --fail http://localhost:3002/api/health
```

`GET /api/health/flux` is an authenticated application diagnostic and reports only provider/model
status. Generation may take several minutes on first load; the server polls for up to ten minutes
and reports offline, provider, and timeout failures honestly.

## Billing

Billing stays disabled unless all Stripe variables are configured. The UI shows an unavailable
state rather than granting paid access. Checkout and portal routes require authentication and a
trusted request origin. Subscription access changes only from verified Stripe webhook events.

Register `/api/billing/webhook` for:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

See [docs/42-STRIPE-TESTING.md](./docs/42-STRIPE-TESTING.md).

## Validation and production build

```sh
pnpm db:validate
pnpm db:generate
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
pnpm build
```

Production startup:

```sh
pnpm --filter @aphrodite/web start -- --hostname 127.0.0.1 --port 3002
```

## Troubleshooting

### Port 3000 or 3002 is already occupied

Local Aphrodite uses port 3002. Find the existing listener before starting another server:

```sh
lsof -nP -iTCP:3002 -sTCP:LISTEN
```

Stop the stale process or keep using the already-running Aphrodite instance.

### PostgreSQL volume or major-version mismatch

The Compose service is explicitly PostgreSQL 17 and uses the named project/volume
`aphrodite_postgres_data`. Do not delete an existing volume. Back it up and use `pg_dump` /
`pg_restore` when moving between PostgreSQL major versions.

### Prisma Client is missing or stale

```sh
pnpm db:generate
```

Restart the Next.js process after schema changes.

### Authentication errors or redirect loops

Use a 32+ character `AUTH_SECRET` and ensure `NEXTAUTH_URL` exactly matches the browser origin,
including port 3002. Restart the server after changing either value.

### FLUX is unavailable or times out

Confirm ComfyUI is running at `COMFYUI_URL`, check `/system_stats`, verify the checkpoint named by
`FLUX_MODEL`, and inspect the ComfyUI terminal. The application timeout is ten minutes.

### ComfyUI returns an unexpected payload

Use the API-format workflow in `apps/web/lib/ai/workflows/flux-schnell.json`. ComfyUI must return a
`prompt_id`, then an image entry from `/history/{promptId}`.

### A generated file exists but does not render

The signed-in user must own a `CreatorAsset` whose `imageUrl` exactly matches the protected proxy
URL. Confirm ComfyUI still has the output and that its `/view` response has an image content type.

### Next.js remote-image errors

Generated images use the same-origin protected proxy and require no unrestricted remote host
configuration. Do not add wildcard image domains.
