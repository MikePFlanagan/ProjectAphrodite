#!/bin/zsh

set -euo pipefail

PROJECT_ROOT="$(
  cd "$(dirname "$0")/.." &&
  pwd
)"

cd "$PROJECT_ROOT"

echo
echo "======================================"
echo " Aphrodite Development Environment"
echo "======================================"
echo

echo "1/3 Starting ARM64 Docker services..."

export DOCKER_DEFAULT_PLATFORM=linux/arm64

docker compose \
  -f docker/compose.yml \
  -f docker/compose.m1.yml \
  up -d

echo
echo "2/3 Starting ComfyUI..."

"$PROJECT_ROOT/scripts/start-comfyui.sh"

echo
echo "3/3 Starting Aphrodite..."

exec pnpm --filter @aphrodite/web dev:3002

