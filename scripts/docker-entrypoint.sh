#!/bin/bash

set -e
set -o pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_step() { echo -e "\n${BLUE}▶ $1${NC}"; }
log_ok() { echo -e "${GREEN}✓ $1${NC}"; }
log_warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
log_err() { echo -e "${RED}✗ $1${NC}"; exit 1; }

APP_NAME_VALUE="${APP_NAME:-Shelfio}"
APP_ID_VALUE="${APP_ID:-com.shelfio.app}"
API_URL_VALUE="${NEXT_PUBLIC_API_URL:-https://gestion-de-books.onrender.com}"

# ── Android SDK (volume persistant — installé une seule fois) ──────────────
log_step "Vérification du Android SDK..."
if [ ! -d "$ANDROID_HOME/cmdline-tools/latest" ]; then
  log_step "Téléchargement des Android SDK command line tools..."
  mkdir -p "$ANDROID_HOME/cmdline-tools"
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip \
      -O /tmp/cmdline-tools.zip
  unzip -q /tmp/cmdline-tools.zip -d /tmp
  mv /tmp/cmdline-tools "$ANDROID_HOME/cmdline-tools/latest"
  rm /tmp/cmdline-tools.zip
  log_ok "Command line tools installés"
fi

if [ ! -d "$ANDROID_HOME/platforms/android-35" ]; then
  log_step "Installation des composants Android SDK (android-35)..."
  yes | sdkmanager --licenses > /dev/null 2>&1 || true
  sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
  log_ok "Android SDK installé"
else
  log_ok "Android SDK déjà présent (volume cache)"
fi

log_step "Installation des dépendances Node.js..."
cd /workspace/frontend
npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps
log_ok "Dépendances installées"

log_step "Build Next.js en mode export statique..."
rm -rf out/
BUILD_TARGET=capacitor NEXT_PUBLIC_API_URL="$API_URL_VALUE" npm run build:mobile
log_ok "Build Next.js terminé — dossier out/ généré"

if [ ! -d "out" ]; then
  log_err "Le dossier out/ n'existe pas. Vérifiez la configuration Next.js pour Capacitor."
fi

log_step "Vérification de la plateforme Android..."
if [ ! -d "android" ]; then
  npx cap add android
  log_ok "Plateforme Android ajoutée"
else
  log_warn "Le dossier android/ existe déjà, réutilisation de la plateforme."
fi

log_step "Synchronisation des assets web vers Android..."
APP_NAME="$APP_NAME_VALUE" APP_ID="$APP_ID_VALUE" NEXT_PUBLIC_API_URL="$API_URL_VALUE" npx cap sync android
log_ok "Synchronisation terminée"

log_step "Reconstruction du module sharp pour Linux x64..."
# sharp est un module natif - doit être recompilé pour Linux (node_modules vient du host Windows)
SHARP_DIR="/workspace/frontend/node_modules/@capacitor/assets/node_modules"
if [ -d "$SHARP_DIR" ]; then
  cd "$SHARP_DIR"
  npm install --platform=linux --arch=x64 sharp --no-save 2>&1 | tail -5
  cd /workspace/frontend
fi
log_ok "Module sharp linux-x64 prêt"

log_step "Génération des icônes Android (Shelfio)..."
npx @capacitor/assets generate --android \
  --iconBackgroundColor '#fffaf8' \
  --splashBackgroundColor '#fffaf8' \
  --assetPath assets
log_ok "Icônes Android générées"

log_step "Compilation de l'APK Android..."
cd /workspace/frontend/android
chmod +x gradlew
./gradlew assembleDebug \
  --no-daemon \
  --stacktrace \
  -Dorg.gradle.jvmargs="-Xmx2g"
log_ok "Compilation terminée"

log_step "Déplacement de l'APK..."
APK_SOURCE="/workspace/frontend/android/app/build/outputs/apk/debug/app-debug.apk"
APK_DEST="/workspace/generated/builds/apk"
SOURCE_DEST="/workspace/generated/source"

mkdir -p "$APK_DEST"
mkdir -p "$SOURCE_DEST"

cp "$APK_SOURCE" "$APK_DEST/app-debug.apk"
rm -rf "$SOURCE_DEST/android"
cp -r /workspace/frontend/android "$SOURCE_DEST/android"
log_ok "APK disponible dans : generated/builds/apk/app-debug.apk"

APK_SIZE=$(du -sh "$APK_DEST/app-debug.apk" | cut -f1)
echo ""
echo -e "${GREEN}BUILD ANDROID TERMINE AVEC SUCCES${NC}"
echo -e " APK : generated/builds/apk/app-debug.apk"
echo -e " Taille : $APK_SIZE"
echo -e " Source : generated/source/android/"