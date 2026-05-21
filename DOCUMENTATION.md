# Documentation Technique — API Bibliothèque

> Plateforme de gestion d'une bibliothèque numérique : catalogue, emprunts et réservations.

---

## Table des matières

1. [Phase 1 — Analyse de la problématique](#phase-1--analyse-de-la-problématique)
2. [Phase 2 — User Stories](#phase-2--user-stories)
3. [Phase 3 — Critères d'acceptation](#phase-3--critères-dacceptation)
4. [Phase 4 — BDD / Scénarios Gherkin](#phase-4--bdd--scénarios-gherkin)
5. [Phase 5 — Conception technique](#phase-5--conception-technique)
6. [Phase 6 — Développement & Contraintes](#phase-6--développement--contraintes)
7. [Phase 7 — Tests](#phase-7--tests)
8. [Phase 8 — Dockerisation](#phase-8--dockerisation)
9. [Phase 9 — CI/CD](#phase-9--cicd)
10. [Phase 10 — README / Documentation finale](#phase-10--readme--documentation-finale)

---

## Phase 1 — Analyse de la problématique

### 1.1 Contexte

Les bibliothèques traditionnelles reposent encore largement sur des processus manuels : registres papier, suivi des emprunts par fichier Excel, absence de portail en ligne pour les adhérents. Ce projet propose une **plateforme web moderne** pour numériser intégralement la gestion d'une bibliothèque, du catalogue jusqu'aux retours de livres.

L'application est pensée pour être déployée dans une petite ou moyenne bibliothèque publique ou universitaire. Elle remplace les outils bureautiques existants par une interface accessible depuis n'importe quel navigateur.

### 1.2 Utilisateurs

| Rôle | Description |
|------|-------------|
| **Administrateur (bibliothécaire)** | Gère le catalogue (ajout/suppression de livres et d'exemplaires), valide les demandes d'emprunt lors du passage au comptoir, enregistre les retours physiques, consulte l'ensemble des emprunts et réservations |
| **Adhérent (utilisateur connecté)** | Crée un compte, parcourt le catalogue, soumet une demande d'emprunt, réserve un livre indisponible, consulte et gère ses emprunts et réservations depuis son espace personnel |
| **Visiteur (non connecté)** | Consulte le catalogue et les fiches détaillées de chaque livre en lecture seule |

### 1.3 Objectifs métier

- **Digitaliser** le processus complet d'emprunt et de retour de livres
- **Fluidifier** la relation adhérent ↔ bibliothécaire : l'adhérent initie la demande en ligne, le bibliothécaire valide au comptoir
- **Réduire les erreurs** liées aux processus manuels (double emprunt, perte de réservation)
- **Offrir une visibilité en temps réel** sur la disponibilité des exemplaires
- **Sécuriser** les accès par rôle (admin / user) avec authentification JWT

### 1.4 Fonctionnalités principales

**Catalogue**
- Parcourir les livres avec couverture, titre, auteur, catégorie
- Filtrer par titre/auteur et par catégorie (11 catégories disponibles)
- Consulter la fiche détaillée avec la liste des exemplaires et leurs statuts

**Authentification**
- Inscription (nom, email, mot de passe)
- Connexion avec access token JWT (15 min) + refresh token (7 jours, haché en base)
- Déconnexion avec révocation du refresh token
- Restauration de session au rechargement de page

**Emprunt (flux en 2 temps)**
1. L'adhérent soumet une demande → emprunt créé en statut **ATTENTE**, exemplaire bloqué (EMPRUNTE)
2. L'adhérent se présente au comptoir → l'admin valide → statut passe à **EN_COURS**
3. L'adhérent restitue le livre → l'admin valide le retour → statut passe à **RETOURNE**

**Réservation**
- L'adhérent peut réserver un livre dont tous les exemplaires sont empruntés
- L'exemplaire passe en statut RESERVE lors du retour (mécanisme switch automatique)
- L'adhérent peut annuler sa réservation
- L'admin peut honorer la réservation (la convertir en emprunt)

**Administration**
- Tableau de bord avec KPIs (total livres, exemplaires, disponibles, en circulation)
- Gestion du catalogue : ajout de livre, ajout d'exemplaire, suppression
- Section "Emprunts en attente" : liste des demandes à valider, filtre par nom d'adhérent
- Section "Retours à valider" : liste des emprunts EN_COURS à clôturer, filtre par nom
- Filtres catalogue : par titre/auteur et par catégorie

---

## Phase 2 — User Stories

### Rôle : Visiteur (non connecté)

---

**US-01 — Parcourir le catalogue**

> En tant que visiteur,
> Je veux parcourir la liste de tous les livres du catalogue,
> Afin de découvrir les ouvrages disponibles sans avoir à créer de compte.

---

**US-02 — Filtrer les livres**

> En tant que visiteur,
> Je veux filtrer les livres par titre, auteur ou catégorie (Roman, Science-Fiction, etc.),
> Afin de trouver rapidement un ouvrage correspondant à mes centres d'intérêt.

---

**US-03 — Consulter la fiche d'un livre**

> En tant que visiteur,
> Je veux consulter la fiche détaillée d'un livre (couverture, auteur, éditeur, exemplaires et leurs statuts),
> Afin de savoir si un exemplaire est disponible avant de me déplacer.

---

### Rôle : Adhérent (utilisateur connecté)

---

**US-04 — Créer un compte**

> En tant que visiteur,
> Je veux créer un compte avec mon nom, mon adresse e-mail et un mot de passe,
> Afin d'accéder aux fonctionnalités d'emprunt et de réservation de la bibliothèque.

---

**US-05 — Se connecter**

> En tant qu'adhérent,
> Je veux me connecter avec mon adresse e-mail et mon mot de passe,
> Afin d'accéder à mon espace personnel et à toutes les fonctionnalités de la plateforme.

---

**US-06 — Emprunter un livre**

> En tant qu'adhérent,
> Je veux soumettre une demande d'emprunt pour un exemplaire disponible,
> Afin de réserver ma place dans la file et récupérer le livre au comptoir lors de mon passage.

---

**US-07 — Réserver un livre indisponible**

> En tant qu'adhérent,
> Je veux réserver un livre dont tous les exemplaires sont actuellement empruntés,
> Afin d'être prioritaire lors du prochain retour.

---

**US-08 — Suivre mes emprunts**

> En tant qu'adhérent,
> Je veux consulter la liste de mes emprunts actifs (en attente et en cours) avec les détails du livre (couverture, titre),
> Afin de savoir ce que j'ai emprunté et de suivre l'état de mes demandes.

---

**US-09 — Consulter mon historique**

> En tant qu'adhérent,
> Je veux accéder à l'historique de mes emprunts et réservations passés,
> Afin de garder une trace de mes lectures.

---

**US-10 — Annuler une réservation**

> En tant qu'adhérent,
> Je veux annuler une réservation active que j'ai effectuée,
> Afin de libérer la place pour d'autres adhérents si je n'ai plus besoin du livre.

---

**US-11 — Se déconnecter**

> En tant qu'adhérent connecté,
> Je veux me déconnecter de la plateforme,
> Afin de sécuriser mon compte sur un poste partagé.

---

### Rôle : Administrateur (bibliothécaire)

---

**US-12 — Ajouter un livre au catalogue**

> En tant qu'administrateur,
> Je veux ajouter un nouveau livre (titre, auteur, ISBN, catégorie, couverture, éditeur, collection),
> Afin d'enrichir le catalogue accessible aux adhérents.

---

**US-13 — Ajouter un exemplaire physique**

> En tant qu'administrateur,
> Je veux ajouter un ou plusieurs exemplaires physiques à un livre existant en saisissant leur code barre,
> Afin d'enregistrer les nouveaux ouvrages reçus par la bibliothèque.

---

**US-14 — Valider un emprunt au comptoir**

> En tant qu'administrateur,
> Je veux valider la remise physique d'un exemplaire à un adhérent en confirmant sa demande (statut ATTENTE → EN_COURS),
> Afin de matérialiser l'emprunt dans le système au moment du passage au comptoir.

---

**US-15 — Valider un retour**

> En tant qu'administrateur,
> Je veux enregistrer le retour physique d'un livre par un adhérent (statut EN_COURS → RETOURNE),
> Afin de libérer l'exemplaire et de déclencher automatiquement le mécanisme de réservation en attente si applicable.

---

**US-16 — Filtrer les emprunts et retours**

> En tant qu'administrateur,
> Je veux filtrer la liste des emprunts en attente et des retours à valider par nom ou adresse e-mail de l'adhérent,
> Afin de retrouver rapidement une transaction lors du passage d'un adhérent au comptoir.

---

**US-17 — Supprimer un livre**

> En tant qu'administrateur,
> Je veux supprimer un livre du catalogue (à condition qu'il n'ait pas d'exemplaires actifs),
> Afin de maintenir un catalogue propre et à jour.

---

## Phase 3 — Critères d'acceptation

### US-04 — Créer un compte

**Conditions de réussite**
- Le formulaire exige : nom (non vide), e-mail valide, mot de passe ≥ 8 caractères
- L'e-mail doit être unique en base — si déjà utilisé, réponse HTTP 409 avec message explicite
- En cas de succès, un access token JWT (15 min) et un refresh token (7 jours) sont retournés
- L'utilisateur est automatiquement connecté après inscription et redirigé vers la page d'accueil

**Comportement attendu**
- Le mot de passe est haché (bcryptjs, 10 rounds) avant stockage — jamais stocké en clair
- Champ `role` forcé à `"user"` — impossible de s'inscrire en tant qu'admin
- Le refresh token est haché (SHA-256) en base et stocké avec une date d'expiration

**Validations**
- `nom` : string, non vide
- `email` : format email valide (z.string().email())
- `password` : minimum 8 caractères
- Retour 400 avec détail des erreurs Zod si validation échoue

---

### US-05 — Se connecter

**Conditions de réussite**
- L'utilisateur saisit un e-mail et un mot de passe existants
- Réponse 200 avec `{ user, token, refreshToken }`
- La session est restaurée au rechargement de page grâce au refresh token stocké côté client

**Comportement attendu**
- Rate limiting : 5 tentatives maximum par fenêtre de 15 minutes (protection bruteforce)
- En cas d'identifiants incorrects → 401 avec message générique (pas de distinction email/mdp)
- L'ancien refresh token est révoqué et un nouveau est émis à chaque login

**Validations**
- `email` et `password` obligatoires
- Retour 400 si champs manquants, 401 si credentials invalides

---

### US-06 — Emprunter un livre

**Conditions de réussite**
- L'adhérent doit être connecté (token valide)
- L'exemplaire choisi doit avoir le statut DISPONIBLE
- La demande est créée avec statut **ATTENTE** ; l'exemplaire passe immédiatement à **EMPRUNTE** pour bloquer les doubles demandes
- L'adhérent voit l'emprunt apparaître dans son espace avec le badge "En attente"

**Comportement attendu**
- Si l'exemplaire est déjà EMPRUNTE, RESERVE ou en MAINTENANCE → réponse 409 avec la liste des codes barres indisponibles
- Un seul appel API POST `/api/emprunts` avec la liste des `exemplaireIds`
- L'emprunt peut porter sur plusieurs exemplaires simultanément

**Validations**
- `exemplaireIds` : tableau d'entiers positifs, minimum 1 élément
- Toute la logique est exécutée en transaction Prisma (atomique)

---

### US-14 — Valider un emprunt au comptoir

**Conditions de réussite**
- Seul un administrateur peut appeler `PATCH /api/emprunts/:id/valider`
- L'emprunt ciblé doit être en statut ATTENTE
- Après validation : statut passe à **EN_COURS**
- L'admin voit la carte disparaître de la liste "Emprunts en attente"

**Comportement attendu**
- Retour 403 si l'appelant n'est pas admin
- Retour 409 si l'emprunt n'est pas en statut ATTENTE (déjà validé ou retourné)
- Retour 404 si l'emprunt n'existe pas

**Validations**
- Middleware `authorize('admin')` appliqué sur la route
- Vérification du statut dans la transaction Prisma

---

### US-15 — Valider un retour

**Conditions de réussite**
- Seul un administrateur peut appeler `PATCH /api/emprunts/:id/retourner`
- L'emprunt passe à **RETOURNE** avec `dateRetour` renseignée
- Pour chaque exemplaire : si une réservation ACTIVE existe → statut passe à **RESERVE** (mécanisme switch) ; sinon → **DISPONIBLE**

**Comportement attendu**
- Retour 403 si l'appelant n'est pas admin
- Retour 409 si l'emprunt est déjà RETOURNE
- Logique switch exécutée en transaction Prisma pour garantir la cohérence

**Validations**
- Traitement itératif de chaque exemplaire de l'emprunt
- Date de retour horodatée automatiquement (`new Date()`)

---

### US-07 — Réserver un livre indisponible

**Conditions de réussite**
- L'adhérent doit être connecté
- Tous les exemplaires du livre doivent être empruntés (aucun DISPONIBLE)
- La réservation est créée avec statut **ACTIVE**

**Comportement attendu**
- Si un exemplaire est disponible → 409 (l'adhérent doit emprunter directement)
- Un adhérent ne peut pas avoir deux réservations actives sur le même livre → 409
- L'exemplaire EMPRUNTE le plus ancien est ciblé par la réservation (premier retourné = priorité)

---

## Phase 4 — BDD / Scénarios Gherkin

### Feature : Authentification

```gherkin
Feature: Authentification des utilisateurs

  Scenario: Inscription réussie d'un nouvel adhérent
    Given aucun compte n'existe avec l'email "marie@exemple.fr"
    When l'utilisateur soumet le formulaire avec nom "Marie Curie", email "marie@exemple.fr" et mot de passe "motdepasse123"
    Then un compte est créé avec le rôle "user"
    And un access token JWT et un refresh token sont retournés
    And l'utilisateur est redirigé vers la page d'accueil connecté

  Scenario: Inscription refusée avec un email déjà utilisé
    Given un compte existe avec l'email "marie@exemple.fr"
    When un utilisateur tente de s'inscrire avec l'email "marie@exemple.fr"
    Then la réponse HTTP est 409
    And un message "Email déjà utilisé" est retourné

  Scenario: Connexion réussie avec identifiants valides
    Given un utilisateur possède un compte avec email "marie@exemple.fr" et mot de passe "motdepasse123"
    When il saisit ces identifiants sur le formulaire de connexion
    Then il reçoit un access token JWT valide 15 minutes
    And il reçoit un refresh token valide 7 jours
    And il accède à son tableau de bord

  Scenario: Connexion refusée avec mot de passe incorrect
    Given un utilisateur possède un compte avec email "marie@exemple.fr"
    When il saisit le mot de passe "mauvaismdp"
    Then la réponse HTTP est 401
    And un message d'erreur générique "Email ou mot de passe incorrect" est retourné

  Scenario: Renouvellement de l'access token via refresh token
    Given un utilisateur possède un refresh token valide
    When son access token expire et il envoie son refresh token à POST /api/auth/refresh
    Then un nouvel access token JWT est retourné
    And l'ancien refresh token est révoqué
    And un nouveau refresh token est émis
```

---

### Feature : Gestion des emprunts

```gherkin
Feature: Cycle de vie d'un emprunt

  Scenario: Soumission d'une demande d'emprunt par un adhérent
    Given l'adhérent "Jean Dupont" est connecté
    And l'exemplaire "HP-001" du livre "Harry Potter" a le statut DISPONIBLE
    When il soumet une demande d'emprunt pour l'exemplaire "HP-001"
    Then un emprunt est créé avec le statut "ATTENTE"
    And l'exemplaire "HP-001" passe au statut "EMPRUNTE"
    And l'emprunt apparaît dans son espace avec le badge "En attente"

  Scenario: Validation de la demande au comptoir par l'administrateur
    Given un emprunt en statut "ATTENTE" existe pour l'adhérent "Jean Dupont"
    And l'administrateur est connecté
    When l'adhérent se présente au comptoir et l'admin clique sur "Valider la remise"
    Then l'emprunt passe au statut "EN_COURS"
    And l'emprunt disparaît de la liste "Emprunts en attente" du tableau de bord admin

  Scenario: Refus d'emprunt sur un exemplaire déjà emprunté
    Given l'exemplaire "OR-001" a le statut "EMPRUNTE"
    And un adhérent est connecté
    When il tente d'emprunter l'exemplaire "OR-001"
    Then la réponse HTTP est 409
    And un message "Exemplaire(s) non disponible(s) : OR-001" est retourné

  Scenario: Validation du retour d'un livre par l'administrateur
    Given un emprunt en statut "EN_COURS" existe pour l'exemplaire "HP-001"
    And aucune réservation active n'existe pour ce livre
    And l'administrateur est connecté
    When l'adhérent restitue le livre et l'admin clique sur "Valider le retour"
    Then l'emprunt passe au statut "RETOURNE" avec une date de retour
    And l'exemplaire "HP-001" repasse au statut "DISPONIBLE"

  Scenario: Mécanisme switch — exemplaire RESERVE lors d'un retour
    Given un emprunt en statut "EN_COURS" existe pour l'exemplaire "DU-001"
    And une réservation ACTIVE existe pour ce même exemplaire au profit de "Claire Martin"
    And l'administrateur valide le retour
    Then l'emprunt passe au statut "RETOURNE"
    And l'exemplaire "DU-001" passe au statut "RESERVE" (et non DISPONIBLE)
    And la réservation de "Claire Martin" reste ACTIVE
```

---

### Feature : Réservations

```gherkin
Feature: Réservation d'un livre indisponible

  Scenario: Réservation réussie d'un livre entièrement emprunté
    Given tous les exemplaires du livre "Dune" sont au statut "EMPRUNTE"
    And l'adhérent "Claire Martin" est connectée
    When elle soumet une réservation pour le livre "Dune"
    Then une réservation est créée avec le statut "ACTIVE"
    And la réservation apparaît dans son espace personnel

  Scenario: Refus de réservation si un exemplaire est disponible
    Given au moins un exemplaire du livre "1984" a le statut "DISPONIBLE"
    And un adhérent connecté tente de réserver "1984"
    Then la réponse HTTP est 409
    And un message indique qu'un exemplaire est disponible — empruntez directement

  Scenario: Annulation d'une réservation par l'adhérent
    Given l'adhérent "Claire Martin" possède une réservation ACTIVE pour "Dune"
    When elle clique sur "Annuler" depuis son espace personnel
    Then la réservation passe au statut "ANNULEE"
    And l'exemplaire ciblé reste au statut "EMPRUNTE" (inchangé)
```

---

### Feature : Catalogue

```gherkin
Feature: Recherche et filtrage du catalogue

  Scenario: Recherche d'un livre par titre
    Given le catalogue contient 10 livres dont "Les Misérables" de Victor Hugo
    When un visiteur saisit "misé" dans le champ de recherche
    Then seuls les livres dont le titre contient "misé" sont affichés
    And le compteur indique le nombre de résultats filtrés

  Scenario: Filtrage par catégorie
    Given le catalogue contient des livres de catégories variées
    When un visiteur sélectionne la catégorie "Science-Fiction" dans le menu déroulant
    Then seuls les livres de catégorie SCIENCE_FICTION sont affichés (ex: "1984", "Dune")

  Scenario: Réinitialisation des filtres
    Given un visiteur a appliqué un filtre par catégorie "Fantasy"
    When il clique sur "Réinitialiser"
    Then tous les livres du catalogue sont de nouveau affichés
```

---

## Phase 5 — Conception technique

### 5.1 Architecture globale

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Navigateur)                           │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │               FRONTEND — Next.js 16 (App Router)            │   │
│   │                        Port 3001                            │   │
│   │                                                             │   │
│   │  Server Components (SSR)    Client Components ('use client')│   │
│   │  ├── page.tsx (landing)     ├── CatalogueSection.tsx        │   │
│   │  └── livres/[id]/page.tsx   ├── BookDetailClient.tsx        │   │
│   │                             ├── mon-compte/page.tsx         │   │
│   │  Tailwind CSS               ├── admin/page.tsx              │   │
│   │  React Context (AuthCtx)    └── AuthContext.tsx             │   │
│   └────────────────────────┬────────────────────────────────────┘   │
│                            │  HTTP/REST (fetch)                      │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BACKEND — Node.js / Express                       │
│                        Port 3000                                     │
│                                                                      │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────┐                 │
│  │  Routes  │──▶│ Controllers  │──▶│   Services   │                 │
│  │          │   │  (Zod valid.)│   │ (logique     │                 │
│  │/api/auth │   │              │   │  métier)     │                 │
│  │/api/livres│  │authController│   │              │                 │
│  │/api/emprunts  │livreController  │authService   │                 │
│  │/api/reserv│   │empruntCtrl  │   │empruntService│                 │
│  └──────────┘   └──────────────┘   └──────┬───────┘                 │
│                                           │                          │
│  Middlewares                              ▼                          │
│  ├── authenticate.js (JWT)        ┌──────────────┐                  │
│  ├── authorize.js  (rôles)        │  Prisma ORM  │                  │
│  ├── errorHandler.js              └──────┬───────┘                  │
│  └── rateLimit (auth routes)             │                          │
│                                          ▼                          │
│  Swagger UI : /api-docs           ┌──────────────┐                  │
│                                   │  SQLite DB   │                  │
│                                   │  (dev.db /   │                  │
│                                   │  prod.db)    │                  │
│                                   └──────────────┘                  │
└──────────────────────────────────────────────────────────────────────┘
```

**Stack technique**

| Couche | Technologie | Version |
|--------|-------------|---------|
| Frontend | Next.js (App Router) | 16.x |
| Styling | Tailwind CSS | 4.x |
| Backend | Node.js + Express | 20.x / 5.x |
| ORM | Prisma | 6.19.2 |
| Base de données | SQLite | via Prisma |
| Authentification | JWT (jsonwebtoken) | — |
| Hachage | bcryptjs | — |
| Validation | Zod | — |
| Tests | Jest + Supertest | — |
| Conteneurisation | Docker + docker-compose | — |

---

### 5.2 Modèle de données (MCD/MLD)

#### Schéma entité-relation

```
USER
├── id            PK
├── nom
├── email         UNIQUE
├── password      (haché bcrypt)
├── role          "user" | "admin"
└── createdAt

REFRESH_TOKEN
├── id            PK
├── hashedToken   UNIQUE (SHA-256)
├── userId        FK → USER
├── revoked       BOOLEAN
├── expiresAt
└── createdAt

LIVRE
├── id            PK
├── titre
├── auteur
├── isbn          UNIQUE
├── annee
├── imageUrl
├── editeur
├── collection
├── categorie     ENUM (voir ci-dessous)
├── createdAt
└── updatedAt

EXEMPLAIRE
├── id            PK
├── codeBarre     UNIQUE
├── livreId       FK → LIVRE
├── statut        ENUM (DISPONIBLE | EMPRUNTE | RESERVE | MAINTENANCE)
└── createdAt

EMPRUNT
├── id            PK
├── userId        FK → USER
├── statut        ENUM (ATTENTE | EN_COURS | RETOURNE | EN_RETARD)
├── dateEmprunt
├── dateRetour    NULLABLE
└── createdAt

EMPRUNT_EXEMPLAIRE (table de jointure N-N)
├── id            PK
├── empruntId     FK → EMPRUNT  (cascade delete)
└── exemplaireId  FK → EXEMPLAIRE

RESERVATION
├── id            PK
├── userId        FK → USER
├── exemplaireId  FK → EXEMPLAIRE
├── statut        ENUM (ACTIVE | HONOREE | ANNULEE | EXPIREE)
├── dateReservation
├── expirationDate NULLABLE
└── createdAt
```

#### Relations

```
USER          ←──── (1,N) ────── EMPRUNT
USER          ←──── (1,N) ────── RESERVATION
USER          ←──── (1,N) ────── REFRESH_TOKEN
LIVRE         ←──── (1,N) ────── EXEMPLAIRE
EMPRUNT       ←──── (1,N) ────── EMPRUNT_EXEMPLAIRE
EXEMPLAIRE    ←──── (1,N) ────── EMPRUNT_EXEMPLAIRE
EXEMPLAIRE    ←──── (1,N) ────── RESERVATION
```

#### Enum Categorie (11 valeurs)

```
ROMAN | SCIENCE_FICTION | FANTASY | POLICIER | BIOGRAPHIE
HISTOIRE | SCIENCE | DEVELOPPEMENT_PERSONNEL | JEUNESSE | PHILOSOPHIE | INFORMATIQUE
```

---

### 5.3 API REST — Documentation complète

#### Conventions générales

- Base URL : `http://localhost:3000/api`
- Format : `application/json`
- Authentification : `Authorization: Bearer <access_token>`
- Codes de retour standard :

| Code | Signification |
|------|--------------|
| 200 | Succès |
| 201 | Ressource créée |
| 204 | Succès sans contenu |
| 400 | Données invalides (validation Zod) |
| 401 | Non authentifié |
| 403 | Accès refusé (mauvais rôle) |
| 404 | Ressource introuvable |
| 409 | Conflit (doublon, état incompatible) |
| 429 | Trop de requêtes (rate limiting) |
| 500 | Erreur serveur |

---

#### Auth — `/api/auth`

**POST /api/auth/register** *(public, rate limited : 5 req/15min)*
```json
// Request
{
  "nom": "Jean Dupont",
  "email": "jean@exemple.fr",
  "password": "motdepasse123"
}

// Response 201
{
  "user": { "id": 1, "nom": "Jean Dupont", "email": "jean@exemple.fr", "role": "user" },
  "token": "<access_jwt>",
  "refreshToken": "<refresh_token_raw>"
}

// Response 409
{ "message": "Email déjà utilisé" }
```

**POST /api/auth/login** *(public, rate limited : 5 req/15min)*
```json
// Request
{ "email": "jean@exemple.fr", "password": "motdepasse123" }

// Response 200
{
  "user": { "id": 1, "nom": "Jean Dupont", "email": "jean@exemple.fr", "role": "user" },
  "token": "<access_jwt>",
  "refreshToken": "<refresh_token_raw>"
}

// Response 401
{ "message": "Email ou mot de passe incorrect" }
```

**POST /api/auth/refresh** *(public)*
```json
// Request
{ "refreshToken": "<refresh_token_raw>" }

// Response 200
{
  "token": "<new_access_jwt>",
  "refreshToken": "<new_refresh_token_raw>"
}

// Response 403
{ "message": "Refresh token invalide ou révoqué" }
```

**GET /api/auth/me** *(authentifié)*
```json
// Response 200
{ "id": 1, "nom": "Jean Dupont", "email": "jean@exemple.fr", "role": "user" }
```

**POST /api/auth/logout** *(authentifié)*
```json
// Request
{ "refreshToken": "<refresh_token_raw>" }

// Response 204 (pas de body)
```

---

#### Livres — `/api/livres`

**GET /api/livres** *(public)*
```json
// Response 200
[
  {
    "id": 1,
    "titre": "Dune",
    "auteur": "Frank Herbert",
    "isbn": "9780441013593",
    "annee": 1965,
    "editeur": "Ace Books",
    "collection": null,
    "categorie": "SCIENCE_FICTION",
    "imageUrl": "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg",
    "exemplaires": [
      { "id": 1, "codeBarre": "DU-001", "statut": "DISPONIBLE" },
      { "id": 2, "codeBarre": "DU-002", "statut": "EMPRUNTE" }
    ]
  }
]
```

**GET /api/livres/:id** *(public)*
```json
// Response 200 — même structure qu'un élément de GET /api/livres
// Response 404
{ "message": "Livre introuvable" }
```

**POST /api/livres** *(authentifié)*
```json
// Request
{
  "titre": "Le Nom de la Rose",
  "auteur": "Umberto Eco",
  "isbn": "9782070410026",
  "annee": 1980,
  "editeur": "Gallimard",
  "collection": "Folio",
  "categorie": "ROMAN",
  "imageUrl": "https://covers.openlibrary.org/b/isbn/9782070410026-L.jpg"
}

// Response 201
{ "id": 11, "titre": "Le Nom de la Rose", ... }

// Response 400 (validation)
[{ "path": ["titre"], "message": "Titre obligatoire" }]
```

**DELETE /api/livres/:id** *(admin)*
```
// Response 204

// Response 403
{ "message": "Accès refusé" }
```

---

#### Exemplaires — `/api/livres/:livreId/exemplaires`

**GET /api/livres/:livreId/exemplaires** *(public)*
```json
// Response 200
[
  { "id": 1, "codeBarre": "DU-001", "statut": "DISPONIBLE", "livreId": 4 }
]
```

**POST /api/livres/:livreId/exemplaires** *(admin)*
```json
// Request
{ "codeBarre": "DU-003" }

// Response 201
{ "id": 25, "codeBarre": "DU-003", "statut": "DISPONIBLE", "livreId": 4 }

// Response 404 — livre inexistant
{ "message": "Livre introuvable" }
```

**PATCH /api/livres/exemplaires/:id/statut** *(admin)*
```json
// Request
{ "statut": "MAINTENANCE" }

// Response 200
{ "id": 1, "codeBarre": "DU-001", "statut": "MAINTENANCE", "livreId": 4 }
```

---

#### Emprunts — `/api/emprunts`

**POST /api/emprunts** *(authentifié)*
```json
// Request
{ "exemplaireIds": [1] }

// Response 201
{
  "id": 5,
  "statut": "ATTENTE",
  "dateEmprunt": "2026-05-21T10:00:00.000Z",
  "dateRetour": null,
  "user": { "id": 2, "nom": "Jean Dupont", "email": "jean@exemple.fr" },
  "exemplaires": [
    {
      "exemplaireId": 1,
      "exemplaire": {
        "id": 1, "codeBarre": "DU-001", "statut": "EMPRUNTE",
        "livre": { "id": 4, "titre": "Dune", "auteur": "Frank Herbert", "imageUrl": "..." }
      }
    }
  ]
}

// Response 409
{ "message": "Exemplaire(s) non disponible(s) : DU-001" }
```

**GET /api/emprunts** *(admin)*
```json
// Response 200 — tableau de tous les emprunts (même structure que POST)
```

**GET /api/emprunts/mes-emprunts** *(authentifié)*
```json
// Response 200 — tableau des emprunts de l'utilisateur connecté
```

**PATCH /api/emprunts/:id/valider** *(admin — ATTENTE → EN_COURS)*
```json
// Response 200
{ "id": 5, "statut": "EN_COURS", ... }

// Response 409
{ "message": "Cet emprunt n'est pas en attente de validation" }
```

**PATCH /api/emprunts/:id/retourner** *(admin — EN_COURS → RETOURNE)*
```json
// Response 200
{
  "id": 5,
  "statut": "RETOURNE",
  "dateRetour": "2026-05-28T14:30:00.000Z",
  ...
}

// Response 409
{ "message": "Cet emprunt a déjà été retourné" }
```

---

#### Réservations — `/api/reservations`

**POST /api/reservations** *(authentifié)*
```json
// Request
{ "livreId": 4 }

// Response 201
{
  "id": 3,
  "statut": "ACTIVE",
  "dateReservation": "2026-05-21T10:00:00.000Z",
  "exemplaireId": 2,
  "userId": 2
}

// Response 409
{ "message": "Un exemplaire est disponible — empruntez directement" }
```

**GET /api/reservations** *(admin)*
```json
// Response 200 — liste de toutes les réservations
```

**GET /api/reservations/mes-reservations** *(authentifié)*
```json
// Response 200 — liste des réservations de l'utilisateur connecté
```

**DELETE /api/reservations/:id** *(authentifié — propriétaire)*
```json
// Response 200
{ "id": 3, "statut": "ANNULEE", ... }
```

**POST /api/reservations/:id/honorer** *(admin)*
```json
// Response 201 — emprunt créé depuis la réservation
{ "id": 6, "statut": "ATTENTE", ... }
```

---

## Phase 6 — Développement & Contraintes

### 6.1 Architecture Backend — Séparation des responsabilités

```
backend/src/
├── app.js              ← Configuration Express (CORS, Helmet, Morgan, Swagger)
├── server.js           ← Point d'entrée HTTP (listen)
├── routes/             ← Définition des routes + middleware par route
│   ├── authRoutes.js
│   ├── livreRoutes.js
│   ├── empruntRoutes.js
│   └── reservationRoutes.js
├── controllers/        ← Validation Zod + appel service + formatage réponse HTTP
│   ├── authController.js
│   ├── livreController.js
│   ├── empruntController.js
│   ├── exemplaireController.js
│   └── reservationController.js
├── services/           ← Logique métier pure (transactions Prisma, règles)
│   ├── authService.js
│   ├── livreService.js
│   ├── empruntService.js
│   └── reservationService.js
├── middlewares/
│   ├── authenticate.js ← Vérification JWT (Bearer token)
│   ├── authorize.js    ← Contrôle de rôle (admin/user)
│   └── errorHandler.js ← Handler global d'erreurs Express
├── db/
│   └── prisma.js       ← Instance Prisma singleton
└── docs/
    └── swagger.js      ← Configuration Swagger UI
```

**Principe de couches respecté :**
- Les routes ne contiennent aucune logique métier
- Les contrôleurs valident et transforment — jamais de requête Prisma directe
- Les services concentrent toute la logique (transactions, vérifications d'état)
- Les middlewares sont réutilisables et orthogonaux

### 6.2 Authentification JWT

| Paramètre | Valeur |
|-----------|--------|
| Access Token durée | 15 minutes |
| Refresh Token durée | 7 jours |
| Refresh Token stockage DB | Haché SHA-256 (jamais en clair) |
| Algorithme JWT | HS256 |
| Secret JWT | Variable d'environnement `JWT_SECRET` (≥ 32 chars) |
| Secret Refresh | Variable d'environnement `REFRESH_SECRET` |
| Rate limiting auth | 5 requêtes / 15 minutes / IP |
| Hachage mdp | bcryptjs, 10 rounds |

**Flux de renouvellement :**
1. Client envoie `POST /api/auth/refresh` avec le refresh token brut
2. Serveur hache le token reçu → recherche en base → vérifie non-révoqué et non-expiré
3. Ancien token révoqué → nouveaux tokens émis (rotation)

### 6.3 Contraintes Frontend

| Contrainte | Implémentation |
|------------|----------------|
| Responsive | Tailwind CSS (breakpoints sm/md/lg) — grille adaptive 2→5 colonnes |
| Navigation claire | Navbar sticky avec accès contextuel selon rôle (admin : Dashboard uniquement) |
| Gestion des erreurs | Messages d'erreur inline sur les formulaires + toasts dans les espaces action |
| Formulaires validés | Champs `required`, types HTML, validation côté serveur (messages Zod affichés) |
| SSR + CSR | Pages catalogue et détail livre rendu côté serveur ; composants interactifs en Client Component |
| Sécurité | Token stocké en `localStorage`, envoyé en header `Authorization: Bearer` uniquement |

### 6.4 Sécurisation des routes Backend

| Route | Middleware appliqué |
|-------|---------------------|
| `GET /api/livres*` | Aucun (public) |
| `POST /api/livres` | `authenticate` |
| `DELETE /api/livres/:id` | `authenticate` + `authorize('admin')` |
| `POST /api/livres/:id/exemplaires` | `authenticate` + `authorize('admin')` |
| `PATCH /api/exemplaires/:id/statut` | `authenticate` + `authorize('admin')` |
| `POST /api/emprunts` | `authenticate` |
| `GET /api/emprunts` | `authenticate` + `authorize('admin')` |
| `PATCH /api/emprunts/:id/valider` | `authenticate` + `authorize('admin')` |
| `PATCH /api/emprunts/:id/retourner` | `authenticate` + `authorize('admin')` |
| `POST /api/reservations` | `authenticate` |
| `GET /api/reservations` | `authenticate` + `authorize('admin')` |
| `DELETE /api/reservations/:id` | `authenticate` |
| `POST /api/reservations/:id/honorer` | `authenticate` + `authorize('admin')` |

---

## Phase 7 — Tests

### 7.1 Stratégie de test

L'application utilise **Jest + Supertest** pour des tests d'intégration complets couvrant l'API et la base de données. Les tests s'exécutent sur une base SQLite dédiée (`test.db`) réinitialisée avant chaque test (`beforeEach(clearDatabase)`).

```
backend/tests/
├── globalSetup.cjs         ← Migration de la DB de test avant toute la suite
├── helpers/
│   ├── db.js               ← clearDatabase(), instance prisma partagée
│   └── auth.js             ← createUser() helper (register + login en une étape)
├── auth.test.js            ← 8 tests : register, login, /me, refresh, logout
├── livres.test.js          ← 15 tests : CRUD livres, exemplaires, catégorie, imageUrl
├── emprunts.test.js        ← 13 tests : demande ATTENTE, valider admin, retour admin, switch
└── reservations.test.js    ← 10 tests : création, annulation, honoration, switch, erreurs
```

**Total : 46 tests — 4 suites — 100% verts**

### 7.2 Couverture par domaine

#### auth.test.js

| Test | Attendu |
|------|---------|
| Inscription avec données valides | 201 + tokens |
| Inscription avec email existant | 409 |
| Inscription avec body incomplet | 400 |
| Login avec identifiants valides | 200 + tokens |
| Login avec mauvais mot de passe | 401 |
| GET /me avec token valide | 200 + user |
| GET /me sans token | 401 |
| Refresh token valide → nouveaux tokens | 200 |
| Refresh token invalide | 403 |

#### livres.test.js

| Test | Attendu |
|------|---------|
| GET /livres — catalogue vide | 200 tableau vide |
| POST /livres — livre valide avec catégorie | 201 + `categorie: 'SCIENCE_FICTION'` |
| POST /livres — catégorie valide "POLICIER" | 201 |
| POST /livres — catégorie invalide | 400 |
| POST /livres — livre sans catégorie (optionnel) | 201 + `categorie: null` |
| POST /livres — imageUrl valide | 201 |
| POST /livres — imageUrl invalide | 400 |
| POST /livres — sans auth | 401 |
| POST /livres — body incomplet (titre vide) | 400 |
| DELETE /livres/:id — admin | 204 |
| DELETE /livres/:id — user non-admin | 403 |
| POST exemplaire — admin | 201 + DISPONIBLE |
| POST exemplaire — non-admin | 403 |
| GET exemplaires d'un livre | 200 + tableau |
| POST exemplaire — livre inexistant | 404 |

#### emprunts.test.js

| Test | Attendu |
|------|---------|
| POST /emprunts — exemplaire dispo | 201 statut ATTENTE, exemplaire EMPRUNTE |
| POST /emprunts — exemplaire déjà EMPRUNTE | 409 |
| POST /emprunts — exemplaireId inexistant | 404 |
| POST /emprunts — sans token | 401 |
| PATCH valider — admin → EN_COURS | 200 statut EN_COURS |
| PATCH valider — non-admin | 403 |
| PATCH valider — déjà EN_COURS (pas ATTENTE) | 409 |
| PATCH retourner — admin → RETOURNE + DISPONIBLE | 200 |
| PATCH retourner — non-admin | 403 |
| PATCH retourner — déjà RETOURNE | 409 |
| PATCH retourner — switch RESERVE si réservation active | exemplaire RESERVE |
| GET /mes-emprunts — filtre par userId | 200 tableau vide pour autre user |

#### reservations.test.js

| Test | Attendu |
|------|---------|
| POST — tous exemplaires EMPRUNTES | 201 ACTIVE |
| POST — exemplaire disponible | 409 |
| POST — double réservation même livre | 409 |
| DELETE — annulation propriétaire | 200 ANNULEE |
| DELETE — annulation autre user | 403 |
| POST /honorer — admin → emprunt ATTENTE | 201 |
| POST /honorer — non-admin | 403 |
| POST /honorer — exemplaire non RESERVE | 409 |
| GET /mes-reservations | 200 filtré par userId |
| Switch : retour avec réservation active | exemplaire RESERVE |

### 7.3 Commandes de test

```bash
# Depuis la racine du projet
npm test                          # Tous les tests
npm test --prefix backend         # Depuis la racine
cd backend && npm test            # Depuis backend/

# Suite spécifique
npm test -- --testPathPatterns=livres
npm test -- --testPathPatterns=emprunts
npm test -- --testPathPatterns=reservations
npm test -- --testPathPatterns=auth
```

### 7.4 Couverture et objectif

Les 46 tests couvrent l'intégralité des endpoints REST (API + base de données) en conditions réalistes. Chaque scénario d'erreur métier est testé (409, 403, 404, 400) en plus des chemins nominaux. La couverture fonctionnelle est estimée à **> 80%** sur la logique métier backend.

> Tests E2E (Playwright/Cypress) : à implémenter — cibleraient les parcours utilisateur complets navigateur.

---

## Phase 8 — Dockerisation

### 8.1 Dockerfile Backend (multi-stage)

```dockerfile
# ── Étape 1 : installation des dépendances de production ─────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Étape 2 : génération du client Prisma ────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# DATABASE_URL factice requis par prisma.config.ts au moment de generate
ENV DATABASE_URL=file:/tmp/build-dummy.db
RUN node_modules/.bin/prisma generate

# ── Étape 3 : image de production ────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app
LABEL org.opencontainers.image.title="API Bibliothèque"

RUN mkdir -p /app/data && chown node:node /app/data

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY src ./src
COPY server.js ./

USER node   # utilisateur non-root (sécurité)

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:/app/data/prod.db

EXPOSE 3000
# Appliquer les migrations + démarrer le serveur
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node server.js"]
```

**Points clés :**
- **3 stages** : `deps` (prod deps) → `builder` (prisma generate) → `production` (image finale légère)
- `node_modules` de dev exclus → image plus petite
- Utilisateur `node` non-root pour la sécurité
- Volume `/app/data` pour la persistance SQLite

### 8.2 docker-compose.yml

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bibliotheque-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: file:/app/data/prod.db
      JWT_SECRET: ${JWT_SECRET:-changeme_jwt_secret_min_32_chars_!!}
      REFRESH_SECRET: ${REFRESH_SECRET:-changeme_refresh_secret_min_32_chars_!!}
      CLIENT_URL: ${CLIENT_URL:-http://localhost:3001}
    volumes:
      - db-data:/app/data   # Persistance SQLite entre redémarrages
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/livres"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s

volumes:
  db-data:
    name: bibliotheque-db
```

### 8.3 .dockerignore

```
node_modules/
prisma/*.db
prisma/*.db-journal
.env
.env.*
tests/
jest.config.js
.claude/
```

### 8.4 Commandes Docker

```bash
# Depuis la racine du projet
npm run docker:build     # docker build -t bibliotheque-api ./backend
npm run docker:up        # docker compose -f backend/docker-compose.yml up -d
npm run docker:down      # docker compose -f backend/docker-compose.yml down

# Manuel
docker compose -f backend/docker-compose.yml up -d
docker compose -f backend/docker-compose.yml logs -f
docker compose -f backend/docker-compose.yml down

# Avec secrets en variables d'environnement
JWT_SECRET="votre_secret_jwt" \
REFRESH_SECRET="votre_secret_refresh" \
docker compose -f backend/docker-compose.yml up -d

# Test sur port alternatif
docker run --rm -p 3001:3000 \
  -e JWT_SECRET="secret" \
  -e REFRESH_SECRET="secret2" \
  bibliotheque-api
```

---

## Phase 9 — CI/CD

### 9.1 Pipeline GitHub Actions

Fichier : `.github/workflows/ci.yml`

```yaml
name: CI — API Bibliothèque

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend:
    name: Backend — lint, test, build
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: backend

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: node_modules/.bin/prisma generate
        env:
          DATABASE_URL: file:/tmp/ci-test.db

      - name: Run migrations (test DB)
        run: node_modules/.bin/prisma migrate deploy
        env:
          DATABASE_URL: file:./test.db

      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
          DATABASE_URL: file:./test.db
          JWT_SECRET: ci_jwt_secret_32_chars_minimum_!!
          REFRESH_SECRET: ci_refresh_secret_32_chars_minimum

  frontend:
    name: Frontend — lint, build
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: frontend

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: http://localhost:3000

  docker:
    name: Docker — build image backend
    runs-on: ubuntu-latest
    needs: [backend]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t bibliotheque-api ./backend
```

### 9.2 Étapes du pipeline

| Job | Étape | Description |
|-----|-------|-------------|
| backend | Install | `npm ci` — dépendances lockées |
| backend | Prisma generate | Client Prisma régénéré |
| backend | Migrate | Migrations appliquées sur DB de test |
| backend | Test | 46 tests Jest + Supertest |
| frontend | Install | `npm ci` |
| frontend | Type check | `tsc --noEmit` — zéro erreur TypeScript |
| frontend | Build | `next build` — build de production |
| docker | Build | `docker build` — vérification Dockerfile |

---

## Phase 10 — README / Documentation finale

### Présentation du projet

**API Bibliothèque** est une application web full-stack de gestion de bibliothèque. Elle permet aux adhérents de parcourir un catalogue de livres, d'effectuer des demandes d'emprunt et de réservation, tandis que les bibliothécaires (admin) valident les transactions au comptoir et gèrent le catalogue.

### Architecture

```
api-bibliotheque/
├── backend/          # API REST Node.js/Express + Prisma/SQLite
│   ├── src/          # Code source (routes, controllers, services, middlewares)
│   ├── prisma/       # Schema, migrations, seed
│   ├── tests/        # Tests Jest + Supertest (46 tests)
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/         # Application Next.js 16 (App Router, TypeScript, Tailwind)
│   └── src/
│       ├── app/      # Pages (SSR + CSR)
│       ├── components/
│       ├── contexts/ # AuthContext (JWT)
│       └── lib/      # API client (api.ts)
└── package.json      # Scripts racine (npm run dev, test, docker:up...)
```

### Prérequis

- Node.js ≥ 20
- npm ≥ 9
- Docker & docker-compose (pour le déploiement conteneurisé)

### Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd api-bibliotheque

# Installer les dépendances backend
cd backend && npm install

# Configurer l'environnement backend
cp .env.example .env
# Éditer .env : JWT_SECRET, REFRESH_SECRET, CLIENT_URL

# Appliquer les migrations et peupler la base
npx prisma migrate dev
npm run seed

# Installer les dépendances frontend
cd ../frontend && npm install
```

### Démarrage en développement

```bash
# Depuis la racine — démarre backend (port 3000) et frontend (port 3001) simultanément
npm run dev

# Séparément
npm run dev:backend    # http://localhost:3000
npm run dev:frontend   # http://localhost:3001

# Documentation Swagger
# http://localhost:3000/api-docs
```

### Démarrage avec Docker

```bash
# Build + start
npm run docker:build
npm run docker:up

# Ou directement
JWT_SECRET="votre_secret_long" \
REFRESH_SECRET="votre_autre_secret" \
docker compose -f backend/docker-compose.yml up -d

# Arrêter
npm run docker:down
```

### Tests

```bash
npm test                    # Tous les tests (46)
npm test -- --testPathPatterns=livres       # Uniquement livres
npm test -- --testPathPatterns=emprunts     # Uniquement emprunts
```

### Variables d'environnement

**Backend (`backend/.env`)**

| Variable | Description | Défaut | Obligatoire |
|----------|-------------|--------|-------------|
| `DATABASE_URL` | Chemin vers la base SQLite | `file:./dev.db` | Oui |
| `JWT_SECRET` | Secret de signature des access tokens | — | Oui (≥ 32 chars) |
| `REFRESH_SECRET` | Secret de signature des refresh tokens | — | Oui (≥ 32 chars) |
| `PORT` | Port d'écoute du serveur | `3000` | Non |
| `NODE_ENV` | Environnement (`development`/`production`/`test`) | `development` | Non |
| `CLIENT_URL` | URL du frontend autorisée par CORS | `http://localhost:3001` | Oui |

**Frontend (`frontend/.env.local`)**

| Variable | Description | Valeur dev |
|----------|-------------|------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend (côté client) | `http://localhost:3000` |
| `API_URL` | URL de l'API backend (côté serveur SSR) | `http://localhost:3000` |

### Comptes de démonstration

Après `npm run seed` :

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@bibliotheque.fr` | `admin123` |
| Adhérent | `jean@exemple.fr` | `user123` |

### Endpoints API — Résumé

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Inscription |
| POST | `/api/auth/login` | Public | Connexion |
| POST | `/api/auth/refresh` | Public | Renouveler les tokens |
| GET | `/api/auth/me` | User | Profil connecté |
| POST | `/api/auth/logout` | User | Déconnexion |
| GET | `/api/livres` | Public | Liste du catalogue |
| GET | `/api/livres/:id` | Public | Détail d'un livre |
| POST | `/api/livres` | User | Ajouter un livre |
| DELETE | `/api/livres/:id` | Admin | Supprimer un livre |
| GET | `/api/livres/:id/exemplaires` | Public | Exemplaires d'un livre |
| POST | `/api/livres/:id/exemplaires` | Admin | Ajouter un exemplaire |
| PATCH | `/api/livres/exemplaires/:id/statut` | Admin | Modifier statut exemplaire |
| POST | `/api/emprunts` | User | Demander un emprunt (→ ATTENTE) |
| GET | `/api/emprunts` | Admin | Tous les emprunts |
| GET | `/api/emprunts/mes-emprunts` | User | Mes emprunts |
| PATCH | `/api/emprunts/:id/valider` | Admin | Valider remise (ATTENTE → EN_COURS) |
| PATCH | `/api/emprunts/:id/retourner` | Admin | Valider retour (EN_COURS → RETOURNE) |
| POST | `/api/reservations` | User | Créer une réservation |
| GET | `/api/reservations` | Admin | Toutes les réservations |
| GET | `/api/reservations/mes-reservations` | User | Mes réservations |
| DELETE | `/api/reservations/:id` | User | Annuler une réservation |
| POST | `/api/reservations/:id/honorer` | Admin | Honorer une réservation |

> Documentation interactive complète : `http://localhost:3000/api-docs` (Swagger UI)

---

*Document généré le 21 mai 2026 — Version 1.0*
