#!/bin/zsh

set -u

echo "Aphrodite Development Environment"
echo "================================="
echo

ARCH="$(uname -m)"
echo "Host architecture: $ARCH"

if [ "$ARCH" = "arm64" ]; then
  echo "✓ Apple Silicon detected"
else
  echo "⚠ Expected arm64, received $ARCH"
fi

echo

if docker info >/dev/null 2>&1; then
  echo "✓ Docker daemon is running"
  echo "  Docker architecture: $(docker info --format '{{.Architecture}}')"
else
  echo "✗ Docker daemon is not running"
fi

echo

POSTGRES_RUNNING="$(
  docker compose \
    -f docker/compose.yml \
    -f docker/compose.m1.yml \
    ps --status running --services 2>/dev/null |
    grep '^postgres$' ||
    true
)"

if [ "$POSTGRES_RUNNING" = "postgres" ]; then
  echo "✓ PostgreSQL is running in Docker"
else
  echo "⚠ PostgreSQL is not currently running"
fi

echo

if curl -fsS \
  http://127.0.0.1:8188/system_stats \
  >/dev/null 2>&1; then
  echo "✓ ComfyUI is running at http://127.0.0.1:8188"
else
  echo "⚠ ComfyUI is not currently responding"
fi

echo

if curl -fsS \
  http://127.0.0.1:3002 \
  >/dev/null 2>&1; then
  echo "✓ Aphrodite is running at http://127.0.0.1:3002"
else
  echo "⚠ Aphrodite is not currently responding"
fi
