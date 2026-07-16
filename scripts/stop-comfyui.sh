#!/bin/zsh

set -u

COMFYUI_DIR="${COMFYUI_DIR:-$HOME/Documents/ComfyUI}"
PID_FILE="$COMFYUI_DIR/logs/aphrodite-comfyui.pid"
COMFYUI_URL="http://127.0.0.1:8188"

stop_pid() {
  local pid="$1"

  if [ -z "$pid" ] || ! kill -0 "$pid" 2>/dev/null; then
    return
  fi

  echo "Stopping ComfyUI process $pid..."
  kill -TERM "$pid" 2>/dev/null || true

  for attempt in {1..15}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      echo "✓ Process $pid stopped."
      return
    fi

    sleep 1
  done

  echo "Process $pid did not stop gracefully; forcing shutdown..."
  kill -KILL "$pid" 2>/dev/null || true
}

if [ -f "$PID_FILE" ]; then
  PID_FROM_FILE="$(cat "$PID_FILE" 2>/dev/null || true)"
  stop_pid "$PID_FROM_FILE"
  rm -f "$PID_FILE"
fi

PORT_PIDS="$(lsof -tiTCP:8188 -sTCP:LISTEN 2>/dev/null || true)"

if [ -n "$PORT_PIDS" ]; then
  for pid in ${(f)PORT_PIDS}; do
    stop_pid "$pid"
  done
fi

for attempt in {1..10}; do
  if ! curl -fsS "$COMFYUI_URL/system_stats" >/dev/null 2>&1; then
    echo "✓ ComfyUI is stopped and port 8188 is free."
    exit 0
  fi

  sleep 1
done

echo "✗ ComfyUI is still responding at $COMFYUI_URL"
echo
echo "Processes still using port 8188:"
lsof -nP -iTCP:8188 -sTCP:LISTEN 2>/dev/null || true
exit 1
