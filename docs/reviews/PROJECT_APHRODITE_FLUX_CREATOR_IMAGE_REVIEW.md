# Project Aphrodite — FLUX, ComfyUI, Creator Tools, and Image Pipeline Review

**Review status:** Complete  
**Area score:** 6.5/10  
**Ship status for this area:** Good local prototype; not production-ready as currently deployed.

## Executive Summary

The local FLUX integration is a meaningful working foundation:

- The application builds a ComfyUI workflow from validated inputs.
- It submits the workflow, polls history, and returns a protected proxy URL.
- Generated-image access checks for a creator asset owned by the current user.
- Creator drafts, assets, and references are user-scoped.
- The workflow has basic unit coverage.

The central production issue is architectural: a Vercel-hosted application cannot use `127.0.0.1:8188` to reach ComfyUI running on the user's Mac. Production image generation therefore needs a reachable worker or hosted provider.

There are also significant abuse and data-integrity issues:

- Image generation has no quota or concurrency limit.
- A user can register an arbitrary generated-image query as their own asset.
- Reference uploads trust declared size rather than decoded bytes.
- Base64 images are stored directly in PostgreSQL.
- Polling requests lack per-request timeouts and cancellation.
- Generated files are not durably stored by the application.

## FLUX / ComfyUI Findings

### Strength — Workflow mutation is isolated and tested

`buildWorkflow()` maps validated generation fields into a versioned JSON workflow. This is a clean boundary.

### Critical — Localhost ComfyUI is not a production deployment path

In production, `127.0.0.1` refers to the deployed server instance, not the user's workstation.

**Recommended change:** Choose one production strategy:

1. A private GPU worker reachable through an authenticated API
2. A managed image-generation provider
3. A job queue with workers that can access ComfyUI
4. A desktop-only/local product mode explicitly separated from the hosted web product

Do not expose ComfyUI directly to the public internet.

### High Priority — Add generation quotas and job concurrency controls

An authenticated user can request large images, up to 50 steps, repeatedly.

**Recommended change:**

- Plan-based daily generation quota
- Per-user concurrent job limit
- Global worker concurrency
- Maximum pixels and steps by plan
- Request timeout
- Cancellation
- Job status persistence

### High Priority — Prevent arbitrary image-claiming

The creator asset API accepts any string beginning with `/api/generated-image?`. It does not verify that:

- The image resulted from that user's generation request
- The prompt ID belongs to the user
- The filename was returned by the user's ComfyUI job

A user who guesses a filename/query could create an asset record and then pass the ownership check in the proxy.

**Recommended change:** Persist a server-created generation job before submission. Bind the ComfyUI `promptId` and output metadata to the authenticated user server-side. Only server-side completion logic should create the authorized output record.

### High Priority — Add fetch timeouts and cancellation

Queue submission and history polling fetches can hang. The outer ten-minute deadline does not abort an individual stuck fetch.

**Recommended change:** Use `AbortController` for every ComfyUI request and carry request cancellation through the generation job.

### Medium Priority — Validate ComfyUI output types

`type` is treated as a generic string inside the ComfyUI response and later accepted by a narrower proxy schema.

**Recommended change:** Validate provider responses before constructing application URLs.

### Medium Priority — Avoid exposing provider errors directly

ComfyUI node errors can be serialized into a user-facing message. Those messages may reveal model names, node details, or local configuration.

**Recommended change:** Log detailed provider errors internally and return stable public error codes.

## Creator Tool Findings

### Strength — Draft ownership is consistently checked

Drafts and assets are scoped to `creatorId` and the active user.

### Medium Priority — Define creator permissions explicitly

Any authenticated user appears able to create an unpublished character draft. This may be intentional, but it is not enforced through plan or role policy.

**Recommended change:** Decide and document whether creator access is:

- Available to everyone
- Restricted to `CREATOR`
- Restricted by subscription plan
- Controlled through feature flags

Centralize the rule.

### Medium Priority — Limit creator metadata payloads

`locks`, `promptValues`, and other JSON structures have field limits but not always an overall serialized-size limit.

**Recommended change:** Enforce maximum array lengths and total request-body size.

### Medium Priority — Add publishing workflow controls

The review archive shows draft editing but no complete moderation, publishing approval, or asset promotion path.

**Recommended change:** Before user-generated characters go public, add:

- Draft validation
- Content safety review
- Ownership confirmation
- Publishing state machine
- Audit timestamps
- Admin moderation
- Unpublish capability

## Reference Image Findings

### Critical — Declared size is not actual size

The request includes `sizeBytes`, but the server does not decode the data URL and verify its true size. The `dataUrl` field also lacks a strict encoded length maximum.

**Recommended change:** Decode on the server, inspect magic bytes, verify MIME type, enforce actual byte size, and reject malformed or oversized payloads.

### High Priority — Do not store base64 images in PostgreSQL

Move reference bytes to object storage or controlled file storage.

### High Priority — Strip metadata and normalize images

Uploads may contain EXIF metadata or malformed image structures.

**Recommended change:**

- Decode with a trusted image library
- Strip metadata
- Enforce dimensions
- Re-encode into approved formats
- Compute a content hash
- Reject decompression bombs

## Generated Image Delivery Findings

### Medium Priority — Output durability is not guaranteed

The application proxies files from ComfyUI's output storage. If ComfyUI cleans its output directory, the database asset remains but the image disappears.

**Recommended change:** Copy completed outputs into durable application-owned storage before marking jobs complete.

### Medium Priority — Cache policy assumes immutability

The proxy returns a one-year immutable private cache header, but the underlying local file is not guaranteed to remain available forever.

**Recommended change:** Use durable versioned storage keys or a shorter cache policy until durability exists.

### Medium Priority — Content security response headers are incomplete

**Recommended change:** Add:

- `X-Content-Type-Options: nosniff`
- Strict MIME allowlist
- Content length where available
- Safe content-disposition policy

## Suggested Sprint

### Sprint title

**Secure Image Job Pipeline**

### In scope

- Add `GenerationJob` and `GeneratedOutput` persistence
- Bind prompt IDs and outputs to users server-side
- Add generation quotas and concurrency controls
- Add per-request timeouts and cancellation
- Verify actual reference-image bytes
- Move reference/generated images toward durable storage
- Normalize uploads and strip metadata
- Define creator access rules
- Improve provider error handling
- Expand integration tests

### Out of scope

- Training custom models
- Video generation
- Public ComfyUI exposure
- Multi-region GPU infrastructure
- Major Creator Studio redesign

## Acceptance Criteria

- A user cannot authorize an arbitrary ComfyUI filename by posting an asset record.
- Every generation has a user-owned server-side job record.
- Generation quotas and concurrency limits are enforced atomically.
- All ComfyUI requests time out and can be canceled.
- Uploaded image size and MIME are verified from decoded bytes.
- Reference bytes are no longer returned from PostgreSQL in routine list responses.
- Completed outputs are copied to durable storage.
- Creator access policy is centralized and tested.
- Provider internals are not exposed in client errors.
- Tests cover cross-user output access, oversized upload, forged size, forged image URL, timeout, cancellation, and worker failure.

## Definition of Done

The image system is ready for public production only when generation runs through an authenticated reachable worker, outputs are bound to users server-side, abusive workloads are limited, and image bytes live in durable validated storage rather than trusted client data or transient ComfyUI folders.
