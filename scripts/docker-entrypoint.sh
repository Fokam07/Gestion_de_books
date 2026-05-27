#!/bin/bash
set -e

echo "==> Installation des dépendances npm"
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm config set fetch-retries 5
npm ci

echo "==> Build Next.js (export statique)"
npm run build

echo "==> Ajout de la plateforme Android (si absente)"
if [ ! -d "android" ]; then
  npx cap add android
fi

echo "==> Sync Capacitor → Android"
npx cap sync android

echo "==> Compilation APK debug"
cd android
./gradlew assembleDebug

APK_PATH=$(find . -name "*.apk" -path "*/debug/*" | head -n 1)


if [ -z "$APK_PATH" ]; then
    echo "Erreur : aucun APK trouvé"
    exit 1
fi

echo "APK trouvé : $APK_PATH"

mkdir -p /workspace/apk
cp "$APK_PATH" /workspace/apk/

echo "APK copié dans /workspace/apk"

