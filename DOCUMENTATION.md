# Shelfio — Documentation Technique

> Application de gestion de bibliothèque scolaire : catalogue, emprunts et réservations.

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture](#2-architecture)
3. [Stack technique](#3-stack-technique)
4. [Structure du projet](#4-structure-du-projet)
5. [Base de données](#5-base-de-données)
6. [API REST Backend](#6-api-rest-backend)
7. [Frontend Next.js](#7-frontend-nextjs)
8. [Application mobile (APK Android)](#8-application-mobile-apk-android)
   - [Approche 1 — Build local avec Docker](#approche-1--build-local-avec-docker)
   - [Approche 2 — Build CI/CD avec GitHub Actions](#approche-2--build-cicd-avec-github-actions)
   - [Comparatif des deux approches](#comparatif-des-deux-approches)
9. [Authentification & Sécurité](#9-authentification--sécurité)
10. [Tests](#10-tests)
11. [Déploiement](#11-déploiement)
12. [Variables d'environnement](#12-variables-denvironnement)
13. [Commandes utiles](#13-commandes-utiles)

---

## 1. Vue d'ensemble

**Shelfio** est une application web (et mobile) de gestion de bibliothèque scolaire. Elle permet à trois types d'utilisateurs d'interagir avec le catalogue de livres :

| Rôle | Capacités |
|------|-----------|
| **Étudiant** | Consulter le catalogue, demander un emprunt, réserver un livre indisponible, suivre ses emprunts/réservations |
| **Bibliothécaire** | Gérer les retours, valider les remises de livres |
| **Admin** | Toutes les permissions + gestion du catalogue (ajout/suppression de livres et d'exemplaires) |

**URLs de production :**
- Frontend : déployé sur Vercel
- Backend API : `https://gestion-de-books.onrender.com`

---

## 2. Architecture

```
┌──────────────────────────────────────────────────┐
│                  Client                          │
│  Next.js 16 (Vercel)   /   APK Android           │
│  (React + Tailwind CSS)     (Capacitor 7)        │
└─────────────────┬────────────────────────────────┘
                  │ HTTPS / REST JSON
┌─────────────────▼────────────────────────────────┐
│               Backend API                        │
│       Node.js + Express 5 (Render.com)           │
│       JWT Auth · Zod Validation · Helmet         │
└─────────────────┬────────────────────────────────┘
                  │ Prisma ORM
┌─────────────────▼────────────────────────────────┐
│              Base de données                     │
│           SQLite (dev / prod)                    │
└──────────────────────────────────────────────────┘
```

---

## 3. Stack technique

### Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 20.x | Runtime |
| Express | 5.2 | Framework HTTP |
| Prisma | 6.x | ORM |
| SQLite | — | Base de données |
| JSON Web Token | 9.x | Authentification |
| bcryptjs | 3.x | Hachage des mots de passe |
| Zod | 4.x | Validation des données |
| Helmet | 8.x | En-têtes HTTP de sécurité |
| express-rate-limit | 8.x | Limitation de débit |
| Swagger UI | 5.x | Documentation API interactive |

### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 16.2.6 | Framework React (App Router) |
| React | 19 | UI |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 4.x | Styles |
| Axios | 1.x | Client HTTP |
| React Icons | — | Icônes |

### Mobile
| Technologie | Version | Rôle |
|-------------|---------|------|
| Capacitor | 7.x | Encapsulation web → natif |
| Android SDK | 35 | Cible Android |
| Gradle | 8.11 | Build Android |
| JDK | 21 | Requis par Capacitor 7 |

---

## 4. Structure du projet

```
Gestion_de_books/
├── backend/                  # API Node.js
│   ├── server.js             # Point d'entrée Express
│   ├── prisma/
│   │   ├── schema.prisma     # Modèles de données
│   │   ├── seed.js           # Données initiales
│   │   └── migrations/       # Historique des migrations
│   └── src/
│       ├── app.js            # Configuration Express
│       ├── controllers/      # Logique métier par ressource
│       ├── services/         # Couche service (accès DB)
│       ├── routes/           # Déclaration des routes
│       ├── middlewares/      # Auth, autorisation, erreurs
│       ├── db/prisma.js      # Instance Prisma singleton
│       ├── docs/swagger.js   # Documentation Swagger
│       └── utils/validators.js # Schémas Zod
│
├── frontend/                 # Application Next.js
│   ├── src/app/              # Pages (App Router)
│   │   ├── page.tsx          # Accueil / Landing
│   │   ├── auth/             # Login / Register
│   │   ├── books/            # Catalogue public
│   │   ├── dashboard/
│   │   │   ├── student/      # Espace étudiant
│   │   │   ├── librarian/    # Espace bibliothécaire
│   │   │   └── admin/        # Panneau d'administration
│   │   └── profile/          # Profil utilisateur
│   ├── src/components/       # Composants réutilisables
│   ├── src/context/          # AuthContext (React Context)
│   ├── src/lib/api.ts        # Client Axios + types TypeScript
│   └── capacitor.config.ts   # Configuration Capacitor
│
├── docker/                   # Build Docker (APK local)
│   ├── Dockerfile            # Image eclipse-temurin:21 + Node 20
│   └── docker-compose.yml    # Service android-builder + volumes
│
├── scripts/
│   └── docker-entrypoint.sh  # Script de build APK dans Docker
│
├── generated/
│   └── builds/apk/           # APK généré (app-debug.apk)
│
└── docker-compose.yml        # Stack complète (backend + frontend)
```

---

## 5. Base de données

### Modèle de données (Prisma / SQLite)

```
User ──< Emprunt ──< EmpruntExemplaire >── Exemplaire >── Livre
  │                                              │
  └──< Reservation >──────────────────── Exemplaire
  │
  └──< RefreshToken
```

#### Entités principales

**`User`**
```
id, nom, email (unique), password (hashed), role (user|librarian|admin), createdAt
```

**`Livre`** — référence bibliographique
```
id, titre, auteur, isbn (unique?), annee, imageUrl, editeur, collection, categorie (enum), createdAt, updatedAt
```

**`Exemplaire`** — objet physique
```
id, codeBarre (unique), livreId, statut (DISPONIBLE|EMPRUNTE|RESERVE|MAINTENANCE), createdAt
```

**`Emprunt`** — session d'emprunt
```
id, userId, statut (ATTENTE|EN_COURS|RETOURNE), dateEmprunt, dateRetour, createdAt
```

**`Reservation`** — file d'attente
```
id, userId, exemplaireId, statut (ACTIVE|HONOREE|ANNULEE), createdAt
```

#### Enum `Categorie`
`ROMAN | SCIENCE_FICTION | FANTASY | POLICIER | BIOGRAPHIE | HISTOIRE | SCIENCE | DEVELOPPEMENT_PERSONNEL | JEUNESSE | PHILOSOPHIE | INFORMATIQUE`

---

## 6. API REST Backend

**Base URL :** `https://gestion-de-books.onrender.com/api`  
**Documentation interactive :** `<base_url>/api-docs`

### Authentification

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| POST | `/auth/register` | Public | Créer un compte |
| POST | `/auth/login` | Public | Connexion → JWT + refresh token |
| POST | `/auth/logout` | Connecté | Révocation du refresh token |
| POST | `/auth/refresh` | Public | Renouvellement du JWT |
| GET | `/auth/me` | Connecté | Profil utilisateur courant |

### Livres

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| GET | `/livres` | Public | Liste tous les livres (avec exemplaires) |
| GET | `/livres/:id` | Public | Détail d'un livre |
| POST | `/livres` | Admin | Créer un livre |
| PUT | `/livres/:id` | Admin | Modifier un livre |
| DELETE | `/livres/:id` | Admin | Supprimer un livre (et ses exemplaires) |

### Exemplaires

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| POST | `/exemplaires` | Admin/Biblio | Ajouter un exemplaire à un livre |
| PATCH | `/exemplaires/:id/statut` | Admin/Biblio | Modifier le statut |
| DELETE | `/exemplaires/:id` | Admin | Supprimer un exemplaire |

### Emprunts

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| POST | `/emprunts` | Étudiant | Créer une demande d'emprunt |
| GET | `/emprunts/mes` | Étudiant | Mes emprunts |
| GET | `/emprunts` | Admin/Biblio | Tous les emprunts |
| PATCH | `/emprunts/:id/valider` | Admin/Biblio | Valider la remise (ATTENTE → EN_COURS) |
| PATCH | `/emprunts/:id/retour` | Admin/Biblio | Valider le retour (EN_COURS → RETOURNE) |

### Réservations

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| POST | `/reservations` | Étudiant | Réserver un livre indisponible |
| GET | `/reservations/mes` | Étudiant | Mes réservations |
| GET | `/reservations` | Admin/Biblio | Toutes les réservations |
| PATCH | `/reservations/:id/annuler` | Étudiant | Annuler une réservation |
| PATCH | `/reservations/:id/honorer` | Étudiant | Convertir en emprunt |

### Format de réponse

```json
// Succès
{ "data": { ... }, "message": "..." }

// Erreur
{ "message": "Description de l'erreur", "errors": [ ... ] }
```

### Middleware d'authentification

Toutes les routes protégées nécessitent :
```
Authorization: Bearer <accessToken>
```

Le token est un JWT signé avec `JWT_SECRET`, valable **15 minutes**. Le refresh token est stocké en base (hashé) et valable **7 jours**.

---

## 7. Frontend Next.js

### Pages

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` | Landing page + HeroCarousel |
| `/auth/login` | Login | Formulaire de connexion |
| `/auth/register` | Register | Formulaire d'inscription |
| `/books` | BooksGrid | Catalogue public |
| `/dashboard/student` | StudentDashboard | Espace étudiant |
| `/dashboard/librarian` | LibrarianDashboard | Espace bibliothécaire |
| `/dashboard/admin` | AdminDashboard | Panneau admin |
| `/profile` | Profile | Profil utilisateur |
| `/about` | About | Page à propos |
| `/contact` | Contact | Contact |

### Gestion de l'authentification

Le contexte `AuthContext` (`src/context/AuthContext.tsx`) fournit :
- `user` — utilisateur courant (`AuthUser | null`)
- `isLoading` — état de chargement initial
- `login(payload)` — connexion + stockage tokens
- `logout()` — déconnexion + révocation refresh token

Les tokens sont stockés dans `localStorage` (`accessToken`, `refreshToken`, `user`).

Le client Axios (`src/lib/api.ts`) gère automatiquement le renouvellement du JWT via un intercepteur : si une requête reçoit un `401`, il tente un refresh et rejoue la requête originale.

### Design system

- **Couleurs primaires :** `#C41C3B` (rouge bordeaux), `#8B1220` (rouge foncé)
- **Police :** Serif pour les titres, sans-serif pour le corps
- **Framework CSS :** Tailwind CSS 4 avec classes utilitaires
- **Responsive :** Mobile-first, breakpoints `sm:` (640px), `md:` (768px), `lg:` (1024px)

---

## 8. Application mobile (APK Android)

L'application mobile est générée depuis le build Next.js exporté en site statique (`output: 'export'`), encapsulé par **Capacitor 7** dans une coque Android native compilée avec Gradle.

### Flux de build commun aux deux approches

```
Code source Next.js
    ↓
next build  (BUILD_TARGET=capacitor → output: 'export')
    ↓  dossier out/ (HTML/CSS/JS statiques)
npx cap sync android  (copie out/ dans android/app/src/main/assets/public)
    ↓
@capacitor/assets generate  (icônes + splash screen Android)
    ↓
./gradlew assembleDebug  (Gradle + Android SDK → APK)
    ↓
app-debug.apk  (≈ 14 MB)
```

### Configuration Capacitor

```typescript
// frontend/capacitor.config.ts
{
  appId: 'com.shelfio.app',
  appName: 'Shelfio',
  webDir: 'out',
  server: { androidScheme: 'https' }
}
```

L'option `output: 'export'` dans `next.config.ts` est activée **uniquement** quand `BUILD_TARGET=capacitor`, afin de garder le déploiement Vercel (SSR) intact.

---

### Approche 1 — Build local avec Docker

#### Pourquoi Docker ?

Générer un APK Android requiert Java 21, Node.js 20, le SDK Android (≈ 300 MB) et Gradle. Ces outils ne sont pas présents sur toutes les machines de développement. Docker permet de **reproduire un environnement de build identique** sans rien installer sur le poste, grâce à un conteneur Linux éphémère.

#### Architecture Docker

| Fichier | Rôle |
|---------|------|
| `docker/Dockerfile` | Image de base : `eclipse-temurin:21-jdk-jammy` + Node.js 20 |
| `docker/docker-compose.yml` | Service `android-builder` + 3 volumes persistants |
| `scripts/docker-entrypoint.sh` | Script exécuté dans le conteneur, orchestre le build |

#### Image Docker (`docker/Dockerfile`)

```dockerfile
FROM eclipse-temurin:21-jdk-jammy
# Node.js 20 via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
COPY scripts/docker-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

L'image embarque **uniquement** Java 21 et Node.js. Le SDK Android n'est **pas** inclus dans l'image pour limiter sa taille — il est installé au premier lancement dans un volume Docker persistant (`android-sdk`).

#### Volumes Docker

```yaml
# docker/docker-compose.yml
volumes:
  android-sdk:        # SDK Android (platform-tools, android-35, build-tools)
  android-gradle-cache:  # Cache Gradle (~/.gradle)
  android-npm-cache:     # Cache npm
```

Ces volumes survivent entre les runs : le SDK n'est téléchargé qu'une seule fois (~300 MB), les builds suivants sont ~3× plus rapides.

#### Script de build (`scripts/docker-entrypoint.sh`)

Le script s'exécute dans le conteneur et enchaîne les étapes :

1. **Vérification du SDK Android** — si le volume `android-sdk` ne contient pas `cmdline-tools/latest`, télécharge `commandlinetools-linux-11076708_latest.zip` et installe `platform-tools`, `platforms;android-35`, `build-tools;35.0.0`
2. **`npm ci`** — installe les dépendances Node.js du frontend
3. **`next build`** (avec `BUILD_TARGET=capacitor`) — génère le dossier `out/`
4. **`cap add android`** / **`cap sync android`** — initialise/synchronise la plateforme Android
5. **Rebuild de `sharp`** pour Linux x64 (module natif compilé sur Windows host → recompilé dans le conteneur)
6. **`@capacitor/assets generate`** — génère icônes et splash screen depuis `assets/icon.png`
7. **`./gradlew assembleDebug`** — compile l'APK Android
8. **Copie** `app-debug.apk` → `generated/builds/apk/app-debug.apk`

#### Commandes

```bash
cd Gestion_de_books

# 1re fois — construit l'image Docker (~5 min selon connexion)
docker compose -f docker/docker-compose.yml build

# Lance le build APK (SDK téléchargé au 1er run ~10 min, puis ~3 min)
docker compose -f docker/docker-compose.yml run --rm android-builder

# Rebuild image depuis zéro (cache supprimé)
docker builder prune -af
docker compose -f docker/docker-compose.yml build --no-cache
```

L'APK est disponible dans `generated/builds/apk/app-debug.apk`.

#### Prérequis

- Docker Desktop (Windows) avec **WSL 2** activé, ou Docker Engine sur Linux/macOS
- ~1 GB d'espace disque libre (image + volumes SDK)
- Connexion internet pour le premier téléchargement du SDK

---

### Approche 2 — Build CI/CD avec GitHub Actions

#### Pourquoi GitHub Actions ?

GitHub Actions permet de **générer l'APK automatiquement dans le cloud** à chaque push, sans aucune installation locale. Les runners `ubuntu-latest` fournis par GitHub disposent déjà de l'environnement Linux, du SDK Android de base et de Java.

#### Déclencheurs du workflow

```yaml
# .github/workflows/build-android.yml
on:
  push:
    branches: [main, develop, prince]
  pull_request:
    branches: [main]
  workflow_dispatch:   # Lancement manuel depuis l'interface GitHub
```

#### Étapes du workflow

| # | Étape GitHub Actions | Description |
|---|---------------------|-------------|
| 1 | `actions/checkout@v4` | Cloner le dépôt |
| 2 | `actions/setup-node@v4` | Node.js 20 avec cache npm |
| 3 | `actions/setup-java@v4` | JDK 21 (distribution Temurin) |
| 4 | `sdkmanager` | Installer `platforms;android-34`, `build-tools;34.0.0`, `platform-tools` |
| 5 | `actions/cache@v4` | Cache Gradle (`~/.gradle/caches` + `wrapper`) |
| 6 | `npm ci` | Installer les dépendances frontend |
| 7 | `npm run build` | Build Next.js avec `BUILD_TARGET=capacitor` → `out/` |
| 8 | Vérification `out/` | Vérifie que le dossier statique a bien été généré |
| 9 | `cap add` / `cap sync` | Initialisation et synchronisation Capacitor Android |
| 10 | `@capacitor/assets generate` | Génération icônes + splash |
| 11 | `chmod +x gradlew` | Permissions Gradle |
| 12 | `./gradlew assembleDebug` | Compilation APK (`-Xmx3g`) |
| 13 | `actions/upload-artifact@v4` | Publication APK comme artefact téléchargeable (30 jours) |
| 14 | Résumé / Notification | Affiche taille, commit, branche dans le résumé du run |

#### Récupérer l'APK depuis GitHub Actions

1. Ouvrir le dépôt sur [github.com](https://github.com/Fokam07/Gestion_de_books)
2. Aller dans **Actions → Build Android APK**
3. Cliquer sur un run réussi (✅)
4. Télécharger l'artefact `app-debug-<sha>.apk` dans la section **Artifacts**

L'APK est retenu **30 jours** par run.

#### Variable d'environnement configurable

| Variable | Défaut | Rôle |
|----------|--------|------|
| `vars.NEXT_PUBLIC_API_URL` | `https://gestion-de-books.onrender.com` | URL de l'API backend injectée dans le build |
| `vars.APP_NAME` | `Shelfio` | Nom de l'application Android |
| `vars.APP_ID` | `com.shelfio.app` | Identifiant du package Android |

Ces variables se configurent dans **Settings → Variables → Repository variables** sur GitHub.

---

### Comparatif des deux approches

| Critère | Docker (local) | GitHub Actions (CI/CD) |
|---------|---------------|----------------------|
| **Environnement** | Conteneur Linux local (WSL 2) | Runner `ubuntu-latest` GitHub |
| **Déclenchement** | Manuel (`docker compose run`) | Automatique sur push / manuel |
| **Prérequis** | Docker Desktop + WSL 2 | Aucun (cloud) |
| **1er build** | ~10 min (télécharge SDK) | ~8 min |
| **Builds suivants** | ~3 min (SDK en volume) | ~5 min (cache Gradle) |
| **APK disponible** | `generated/builds/apk/app-debug.apk` | Artifact GitHub (téléchargeable 30j) |
| **Version Java** | 21 (eclipse-temurin) | 21 (temurin via setup-java) |
| **Android SDK** | Platform 35 + build-tools 35.0.0 | Platform 34 + build-tools 34.0.0 |
| **Usage recommandé** | Test local, itérations rapides | Distribution, validation sur push |

---

## 9. Authentification & Sécurité

### Tokens

| Token | Durée | Stockage backend | Stockage client |
|-------|-------|-----------------|-----------------|
| Access JWT | 15 min | — | `localStorage` |
| Refresh JWT | 7 jours | DB (hashé bcrypt) | `localStorage` |

### Mesures de sécurité

- **Helmet.js** — Headers HTTP sécurisés (CSP, HSTS, X-Frame-Options…)
- **express-rate-limit** — Limitation : 100 req/15 min par IP
- **bcryptjs** — Hachage des mots de passe (salt rounds: 10)
- **Zod** — Validation stricte de toutes les entrées API
- **CORS** — Origines autorisées configurées via `FRONTEND_URL`
- **Refresh token rotation** — Révocation en base à chaque logout
- **Autorisation par rôle** — Middleware `authorize(roles[])` sur chaque route sensible

### Rôles

```
user       → étudiant (accès lecture + emprunt/réservation)
librarian  → bibliothécaire (valider remises/retours)
admin      → toutes permissions (+ gestion catalogue)
```

---

## 10. Tests

Le backend dispose d'une suite de tests d'intégration Jest.

```bash
cd backend

# Lancer les tests (base SQLite de test isolée)
npm test

# En mode watch
npm run test:watch
```

**Fichiers de tests :**
- `tests/auth.test.js` — Register, Login, Refresh, Logout
- `tests/livres.test.js` — CRUD livres + exemplaires
- `tests/emprunts.test.js` — Cycle complet emprunt (demande → validation → retour)
- `tests/reservations.test.js` — Réservation, annulation, conversion

**Configuration :**
- Base de données de test : `file:./test.db` (isolée)
- Setup global : `tests/globalSetup.cjs` (migrations + seed)
- Helpers : `tests/helpers/auth.js` (obtention de tokens), `tests/helpers/db.js` (reset)

---

## 11. Déploiement

### Backend (Render.com)

| Paramètre | Valeur |
|-----------|--------|
| Service | Web Service |
| Build command | `npm install && npx prisma generate && npx prisma migrate deploy` |
| Start command | `node server.js` |
| Node version | 20 |

### Frontend (Vercel)

| Paramètre | Valeur |
|-----------|--------|
| Framework | Next.js |
| Build command | `npm run build` |
| Output directory | `.next` |
| Root directory | `frontend/` |

### Stack complète Docker (développement)

```bash
# Démarrer backend + frontend
docker compose up

# Backend seul : http://localhost:3001
# Frontend seul : http://localhost:3000
```

---

## 12. Variables d'environnement

### Backend (`backend/.env`)

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=<secret_fort_min_32_chars>
REFRESH_TOKEN_SECRET=<secret_fort_min_32_chars>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://gestion-de-books.onrender.com
```

---

## 13. Commandes utiles

### Backend

```bash
cd backend

# Développement
npm run dev

# Migrations Prisma
npx prisma migrate dev --name ma_migration

# Réinitialiser la DB + seed
npx prisma migrate reset

# Inspecter la DB
npx prisma studio

# Générer le client Prisma
npx prisma generate
```

### Frontend

```bash
cd frontend

# Développement
npm run dev          # http://localhost:3000

# Build production
npm run build

# Build mobile (export statique pour Capacitor)
BUILD_TARGET=capacitor npm run build:mobile

# Synchroniser Capacitor
npx cap sync android

# Ouvrir dans Android Studio
npx cap open android
```

### Git

```bash
# Branche principale de développement : prince
git checkout prince
git pull origin prince

# Pousser les changements
git add -A
git commit -m "feat: description"
git push origin prince
```

---

## Glossaire

| Terme | Définition |
|-------|-----------|
| **Livre** | Référence bibliographique (titre, auteur, ISBN…) |
| **Exemplaire** | Objet physique identifié par un code-barres |
| **Emprunt** | Demande d'emprunt d'un ou plusieurs exemplaires |
| **Réservation** | Mise en attente d'un exemplaire actuellement emprunté |
| **ATTENTE** | Emprunt créé, en attente de validation physique à l'accueil |
| **EN_COURS** | Emprunt validé, le livre est en possession de l'étudiant |
| **RETOURNE** | Livre rendu et retour validé par l'administration |
| **ACTIVE** | Réservation en cours |
| **HONOREE** | Réservation convertie en emprunt |

---

*Documentation générée le 27 mai 2026 — Shelfio v1.0*
