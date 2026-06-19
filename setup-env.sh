#!/bin/sh
# Usage: sh setup-env.sh <NOTION_TOKEN> [PORT]
# Example: sh setup-env.sh ntn_xxxxxxxxxxxx 3000
set -e

NOTION_TOKEN="${1:-}"
PORT="${2:-3000}"
ENV_FILE="./packages/api/.env"

if [ -z "$NOTION_TOKEN" ]; then
  echo "ERROR: NOTION_TOKEN is required."
  echo "Usage: sh setup-env.sh <NOTION_TOKEN> [PORT]"
  exit 1
fi

cat > "$ENV_FILE" <<EOF
NOTION_TOKEN=${NOTION_TOKEN}
PORT=${PORT}
EOF

echo ".env generated at $ENV_FILE"
