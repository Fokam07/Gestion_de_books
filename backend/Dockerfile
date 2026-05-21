# ── Étape 1 : installation des dépendances ───────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copier uniquement les fichiers de dépendances pour profiter du cache Docker
COPY package.json package-lock.json ./

# Installer les dépendances de production uniquement (pas jest, nodemon, supertest…)
RUN npm ci --omit=dev

# ── Étape 2 : génération du client Prisma ────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# prisma.config.ts appelle env("DATABASE_URL") même au moment de `generate`
# (qui ne touche pas la base). On passe une valeur factice pour satisfaire
# la validation — elle n'est utilisée qu'à cette étape de build.
ENV DATABASE_URL=file:/tmp/build-dummy.db

# Générer le client Prisma à partir du schema
RUN node_modules/.bin/prisma generate

# ── Étape 3 : image de production ────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

LABEL org.opencontainers.image.title="API Bibliothèque"
LABEL org.opencontainers.image.description="API REST Node.js/Express/Prisma pour la gestion d'une bibliothèque"

# Créer le répertoire de la base SQLite avec les bonnes permissions
# "node" est l'utilisateur non-root fourni par l'image alpine
RUN mkdir -p /app/data && chown node:node /app/data

# Copier les artefacts des étapes précédentes
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Copier le code source
COPY src ./src
COPY server.js ./

# Basculer vers l'utilisateur non-root (sécurité)
USER node

# ── Variables d'environnement ─────────────────────────────────────────────────
ENV NODE_ENV=production
ENV PORT=3000
# La base SQLite pointe vers le volume persistant monté sur /app/data
ENV DATABASE_URL=file:/app/data/prod.db

EXPOSE 3000

# ── Démarrage ─────────────────────────────────────────────────────────────────
# 1. Appliquer les migrations en attente (idempotent : safe à chaque redémarrage)
# 2. Lancer le serveur
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node server.js"]
