# ADR-0001
## Apple Silicon First Development Environment

**Status:** Accepted

## Context

Project Aphrodite is primarily developed on Apple Silicon hardware.

The local AI generation pipeline uses ComfyUI with FLUX models accelerated by
Apple Metal (PyTorch MPS).

Docker is used for infrastructure services while AI inference runs natively to
maximize performance.

## Decision

Local development will follow these principles:

- Native ComfyUI
- Native PyTorch MPS
- Docker for infrastructure
- ARM64 Docker images during local development
- Multi-architecture Docker images for production

## Consequences

Benefits

- Faster AI inference
- Lower memory overhead
- Better developer experience
- One-command development environment

Tradeoffs

- Local environment differs from production
- Native ComfyUI must be installed

