#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo ""
echo "========================================"
echo " BUILD ANDROID - Docker local"
echo "========================================"
echo ""

if ! docker info > /dev/null 2>&1; then
  echo "Docker n'est pas demarre. Lancez Docker Desktop puis reessayez."
  exit 1
fi
echo "✓ Docker est actif"

if [ -f ".env" ]; then
  set -a
  . ./.env
  set +a
  echo "✓ Variables .env chargees"
fi

mkdir -p generated/builds/apk
mkdir -p generated/source/android

echo ""
echo "▶ Lancement du build Docker..."
echo ""

docker compose -f docker/docker-compose.yml run --rm android-builder

echo ""
echo "✅ Build termine ! Votre APK est dans : generated/builds/apk/"