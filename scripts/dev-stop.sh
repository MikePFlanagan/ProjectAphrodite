#!/bin/zsh

set -euo pipefail

PROJECT_ROOT="$(
  cd "$(dirname "$0")/.." &&
  pwd
)"

cd "$PROJECT_ROOT"

echo
echo "======================================"
echo " Stopping Aphrodite Development Stack"
echo "======================================"
echo

echo "1/3 Stopping Aphrodite on port 3002..."

APHRODITE_PIDS="$(lsof -tiTCP:3002 -sTCP:LISTEN 2>/dev/null || true)"

if [ -n "$APHRODITE_PIDS" ]; then
  for pid in ${(f)APHRODITE_PIDS}; do
    echo "Stopping Aphrodite process $pid..."
    kill -TERM "$pid" 2>/dev/null || true
  done
else
  echo "✓ Aphrodite is already stopped."
fi

for attempt in {1..15}; do
  if ! lsof -tiTCP:3002 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "✓ Aphrodite stopped."
    break
  fi

  sleep 1
done

echo
echo "2/3 Stopping ComfyUI..."

"$PROJECT_ROOT/scripts/stop-comfyui.sh"

echo
echo "3/3 Stopping ARM64 Docker services..."

docker compose \
  -f docker/compose.yml \
  -f docker/compose.m1.yml \
  down

echo
echo "✓ Aphrodite development stack is stopped."
