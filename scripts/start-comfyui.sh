#!/bin/zsh

set -euo pipefail

COMFYUI_DIR="${COMFYUI_DIR:-$HOME/Documents/ComfyUI}"
COMFYUI_URL="${COMFYUI_URL:-http://127.0.0.1:8188}"

LOG_DIR="$COMFYUI_DIR/logs"
LOG_FILE="$LOG_DIR/aphrodite-comfyui.log"
PID_FILE="$LOG_DIR/aphrodite-comfyui.pid"
PYTHON_BIN="$COMFYUI_DIR/venv/bin/python"

if curl -fsS "$COMFYUI_URL/system_stats" >/dev/null 2>&1; then
  echo "✓ ComfyUI is already running at $COMFYUI_URL"
  exit 0
fi

if [ ! -d "$COMFYUI_DIR" ]; then
  echo "✗ ComfyUI directory not found: $COMFYUI_DIR"
  exit 1
fi

if [ ! -x "$PYTHON_BIN" ]; then
  echo "✗ ComfyUI Python environment not found: $PYTHON_BIN"
  exit 1
fi

mkdir -p "$LOG_DIR"

echo "Starting native ComfyUI with Apple MPS..."

cd "$COMFYUI_DIR"

nohup "$PYTHON_BIN" \
  "$COMFYUI_DIR/main.py" \
  --listen 127.0.0.1 \
  --port 8188 \
  > "$LOG_FILE" \
  2>&1 &

COMFYUI_PID=$!
echo "$COMFYUI_PID" > "$PID_FILE"

echo "ComfyUI PID: $COMFYUI_PID"
echo "Waiting for ComfyUI..."

for attempt in {1..120}; do
  if curl -fsS "$COMFYUI_URL/system_stats" >/dev/null 2>&1; then
    echo "✓ ComfyUI is ready at $COMFYUI_URL"
    echo "Logs: $LOG_FILE"
    exit 0
  fi

  if ! kill -0 "$COMFYUI_PID" 2>/dev/null; then
    echo "✗ ComfyUI exited before becoming ready."
    tail -n 80 "$LOG_FILE" 2>/dev/null || true
    exit 1
  fi

  sleep 1
done

echo "✗ ComfyUI did not become ready within 120 seconds."
echo "Logs: $LOG_FILE"
exit 1
