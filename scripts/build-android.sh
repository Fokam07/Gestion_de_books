#!/bin/bash
set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$REPO_ROOT/generated"
APK_SRC="$REPO_ROOT/frontend/android/app/build/outputs/apk/debug/app-debug.apk"

echo "==> Lancement du build Android via Docker"
cd "$REPO_ROOT"
docker compose -f docker/docker-compose.yml up --build --abort-on-container-exit

echo "==> Copie de l'APK dans $OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
cp "$APK_SRC" "$OUTPUT_DIR/bibliotheque-debug.apk"

echo ""
echo "APK prêt : $OUTPUT_DIR/bibliotheque-debug.apk"
