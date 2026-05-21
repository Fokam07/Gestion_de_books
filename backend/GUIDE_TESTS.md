# Guide complet : Tester une API Node.js avec Jest et Supertest

> **À qui s'adresse ce guide ?**  
> Tu viens de finir de coder ton API et tu te demandes "comment je sais que tout marche vraiment ?"  
> Ce guide t'explique pas à pas comment mettre en place des tests automatisés sur l'API Bibliothèque.

---

## Sommaire

1. [C'est quoi un test automatisé, et pourquoi c'est important ?](#1-cest-quoi-un-test-automatisé)
2. [Les outils : Jest et Supertest](#2-les-outils)
3. [Installation](#3-installation)
4. [La configuration Jest : `jest.config.js`](#4-la-configuration-jest)
5. [Le problème ESM + Jest et comment on le résout](#5-le-problème-esm--jest)
6. [La base de données de test : `tests/globalSetup.cjs`](#6-la-base-de-données-de-test)
7. [Les helpers partagés](#7-les-helpers-partagés)
   - [7a. `tests/helpers/db.js` — Nettoyer la base entre chaque test](#7a-testshelpersdbjsnettoyer-la-base)
   - [7b. `tests/helpers/auth.js` — Créer un utilisateur en une ligne](#7b-testshelpersauthjs--créer-un-utilisateur-en-une-ligne)
8. [Le script de lancement dans `package.json`](#8-le-script-de-lancement)
9. [Écrire les tests : fichier par fichier](#9-écrire-les-tests)
   - [9a. `tests/auth.test.js`](#9a-testsauthtestjs)
   - [9b. `tests/livres.test.js`](#9b-testslivrestestjs)
   - [9c. `tests/emprunts.test.js`](#9c-testsempruntestestjs)
   - [9d. `tests/reservations.test.js`](#9d-testsreservationstestjs)
10. [Pourquoi on dit que c'est "automatisable" ?](#10-pourquoi-on-dit-que-cest-automatisable-)
11. [Les pièges à éviter](#11-les-pièges-à-éviter)

---

## 1. C'est quoi un test automatisé ?

### Le problème avec les tests manuels

Imagine que tu viens de modifier la logique de retour d'un emprunt. Tu veux vérifier que ça marche encore. Tu dois :

1. Ouvrir Postman (ou ton navigateur)
2. T'inscrire → Te connecter → Récupérer le token
3. Créer un livre → Créer un exemplaire
4. Emprunter → Retourner
5. Vérifier dans la base de données que le statut a changé
6. Recommencer pour tous les cas : un autre user, un mauvais token, un exemplaire déjà emprunté…

**C'est long, c'est répétitif, et on oublie des cas.**

### Ce que font les tests automatisés

Un test automatisé, c'est du **code qui teste ton code**. Tu l'écris une fois, et ensuite tu tapes juste :

```bash
npm test
```

Et en quelques secondes, 38 scénarios sont joués automatiquement. Si l'un d'eux échoue, tu sais exactement où et pourquoi.

### Pourquoi on dit que c'est "automatisable" ?

Parce qu'une fois que les tests existent, **n'importe quel système peut les lancer** sans intervention humaine :

- **GitHub Actions / GitLab CI** : à chaque `git push`, les tests se lancent automatiquement sur un serveur distant.
- **Avant un déploiement** : un pipeline CI/CD vérifie que les tests passent avant de publier une nouvelle version en production.
- **En équipe** : si un collègue casse quelque chose en modifiant le code, les tests l'avertissent avant même que tu t'en rendes compte.

> En résumé : un test manuel, tu l'oublies. Un test automatisé, il travaille pour toi 24h/24.

---

## 2. Les outils

| Outil | Rôle |
|---|---|
| **Jest** | Le framework de test. Il trouve et exécute les fichiers `.test.js`, il gère les `describe`, `it`, `expect`, et affiche les résultats. |
| **Supertest** | Permet de faire des vrais appels HTTP à ton application Express **sans avoir besoin de démarrer le serveur**. Il simule exactement ce que ferait Postman, mais depuis le code. |

### Pourquoi pas Mocha ou Vitest ?

- **Mocha** est plus ancien et nécessite plus de configuration.
- **Vitest** est excellent mais orienté front-end (Vite).
- **Jest** est le standard dans l'écosystème Node.js backend. Il inclut tout : runner, assertions, mocks, coverage. Pas besoin d'installer 5 paquets différents.

---

## 3. Installation

Ces deux paquets sont des **dépendances de développement** : on en a besoin pour tester, pas pour faire tourner l'application en production.

```bash
npm install --save-dev jest supertest
```

Après l'installation, dans `package.json` :

```json
"devDependencies": {
  "jest": "^30.4.2",
  "supertest": "^7.2.2"
}
```

---

## 4. La configuration Jest : `jest.config.js`

Jest a besoin de savoir comment se comporter avec notre projet. On crée ce fichier à la racine :

```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  globalSetup: './tests/globalSetup.cjs',
  testMatch: ['**/tests/**/*.test.js'],
};
```

**Détail de chaque option :**

- **`testEnvironment: 'node'`**  
  Par défaut, Jest simule un environnement navigateur (DOM). On lui dit qu'on est côté serveur Node.js.

- **`transform: {}`**  
  Normalement, Jest transforme le code (Babel, TypeScript…). On désactive ça complètement parce qu'on utilise l'ESM natif de Node.js (voir section suivante).

- **`globalSetup: './tests/globalSetup.cjs'`**  
  Un fichier qui sera exécuté **une seule fois avant tous les tests**. On l'utilise pour préparer la base de données de test.

- **`testMatch: ['**/tests/**/*.test.js']`**  
  Jest cherche les tests dans le dossier `tests/`. Tous les fichiers qui se terminent en `.test.js` sont des tests.

---

## 5. Le problème ESM + Jest

### C'est quoi le problème ?

Notre `package.json` contient `"type": "module"`. Ça signifie que tout notre code utilise la syntaxe **ES Modules** (ESM) — les `import` et `export` modernes :

```javascript
import express from 'express';        // ESM ✓
export default app;                   // ESM ✓

const express = require('express');   // CommonJS (ancienne syntaxe) ✗
module.exports = app;                 // CommonJS ✗
```

Jest, historiquement, ne comprend pas l'ESM nativement. Pour lui dire de le gérer, on ajoute un flag Node.js dans le script de test.

### La solution : `NODE_OPTIONS=--experimental-vm-modules`

Ce flag demande à Node.js d'activer le support expérimental des modules ESM dans Jest. Il est passé directement dans la commande (voir section suivante).

### Pourquoi `globalSetup.cjs` et pas `.js` ?

Il y a une contrainte technique : le `globalSetup` de Jest est chargé **avant** l'activation du mode ESM. Il doit donc être en **CommonJS** (l'ancienne syntaxe). C'est pour ça qu'on utilise l'extension `.cjs` — elle force Node.js à traiter le fichier en CommonJS même quand `"type": "module"` est actif dans `package.json`.

---

## 6. La base de données de test

### Pourquoi une base de données séparée ?

**On ne teste JAMAIS sur la base de données de production ou de développement.**

Si les tests effacent, créent ou modifient des données, ils vont polluer les vraies données. On crée donc une base SQLite séparée, uniquement pour les tests : `prisma/test.db`.

### `tests/globalSetup.cjs`

```javascript
// CJS obligatoire pour globalSetup avec "type":"module"
const { execSync } = require('child_process');

module.exports = async () => {
  // Chemin relatif au schema.prisma (dans prisma/) → test.db sera dans prisma/test.db
  execSync('npx prisma db push --accept-data-loss --skip-generate', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'pipe',
  });
};
```

**Ligne par ligne :**

- `execSync(...)` : exécute une commande shell et attend qu'elle soit finie.
- `npx prisma db push` : lit `prisma/schema.prisma` et **crée toutes les tables** dans la base de données ciblée. C'est différent de `migrate` — ici on force directement la structure sans générer de fichiers de migration.
- `--accept-data-loss` : si la table existe déjà avec une structure différente, on accepte de la recréer. Sans risque car c'est une base de test.
- `--skip-generate` : ne pas regénérer le client Prisma à chaque fois (il a déjà été généré). Ça va beaucoup plus vite.
- `DATABASE_URL: 'file:./test.db'` : pointe vers `test.db`. **Attention** : ce chemin est relatif au fichier `prisma/schema.prisma`, donc la base sera créée dans `prisma/test.db`.

Ce fichier est exécuté **une seule fois avant tous les tests**, pas avant chaque test.

---

## 7. Les helpers partagés

Les helpers, c'est du code utilitaire qu'on réutilise dans plusieurs fichiers de test. Sans eux, on copierait-collerait les mêmes 20 lignes dans chaque fichier.

### 7a. `tests/helpers/db.js` — Nettoyer la base

```javascript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const clearDatabase = async () => {
  await prisma.reservation.deleteMany();
  await prisma.empruntExemplaire.deleteMany();
  await prisma.emprunt.deleteMany();
  await prisma.exemplaire.deleteMany();
  await prisma.livre.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
};
```

**Pourquoi nettoyer avant chaque test ?**

Chaque test doit démarrer dans un état propre, sans données résiduelles du test précédent. Sinon, un test qui crée un user avec l'email `alice@test.com` va échouer si un test précédent a déjà créé ce même user.

On appelle cette fonction dans chaque fichier de test :

```javascript
beforeEach(clearDatabase); // ← s'exécute AVANT chaque test
```

**Pourquoi supprimer dans cet ordre ?**

C'est l'ordre des **contraintes de clé étrangère** (FK). Une `Reservation` référence un `Exemplaire`, donc on ne peut pas supprimer l'`Exemplaire` avant la `Reservation`. On supprime toujours les "enfants" avant les "parents".

### 7b. `tests/helpers/auth.js` — Créer un utilisateur en une ligne

```javascript
import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from './db.js';

let _counter = 0;
const uid = () => ++_counter;

export const createUser = async ({ suffix = uid(), role = 'user' } = {}) => {
  const email = `user${suffix}@test.com`;
  const password = 'Password123!';

  await request(app).post('/api/auth/register').send({
    nom: `User ${suffix}`,
    email,
    password,
  });

  // Pour le rôle admin, on force directement en BD
  if (role === 'admin') {
    await prisma.user.update({ where: { email }, data: { role: 'admin' } });
  }

  const res = await request(app).post('/api/auth/login').send({ email, password });
  const { token, refreshToken } = res.body;

  return {
    email,
    accessToken: token,
    refreshToken,
    authHeader: `Bearer ${token}`,
  };
};
```

**Ce que fait cette fonction :**

1. Génère un email unique (`user1@test.com`, `user2@test.com`…) grâce au compteur `uid()`.
2. Inscrit le user via l'API (vrai appel HTTP).
3. Si on demande `role: 'admin'`, force le rôle directement en base (l'API d'inscription ne permet pas de s'auto-déclarer admin).
4. Connecte le user et récupère le token.
5. Retourne tout ce dont on a besoin pour faire des requêtes authentifiées.

**Utilisation dans un test :**

```javascript
const admin = await createUser({ role: 'admin' });
const user  = await createUser(); // role par défaut = 'user'

// Faire une requête en tant qu'admin :
await request(app)
  .post('/api/livres')
  .set('Authorization', admin.authHeader)
  .send({ titre: 'Dune', auteur: 'Frank Herbert' });
```

Sans ce helper, chaque test devrait répéter l'inscription + connexion + extraction du token. **Le helper centralise ça en une ligne.**

---

## 8. Le script de lancement

Dans `package.json`, la section `scripts` :

```json
"scripts": {
  "test":       "NODE_ENV=test DATABASE_URL=file:./test.db NODE_OPTIONS=--experimental-vm-modules jest --runInBand",
  "test:watch": "NODE_ENV=test DATABASE_URL=file:./test.db NODE_OPTIONS=--experimental-vm-modules jest --runInBand --watch"
}
```

**Décortiquons chaque partie :**

| Morceau | Rôle |
|---|---|
| `NODE_ENV=test` | Indique à l'application qu'elle tourne en mode test. Le rate limiter de l'API auth utilise ça pour se désactiver (sinon les tests seraient bloqués après 5 requêtes). |
| `DATABASE_URL=file:./test.db` | Pointe Prisma vers la base de test. Ce chemin est relatif à `prisma/schema.prisma`, donc la vraie base est `prisma/test.db`. |
| `NODE_OPTIONS=--experimental-vm-modules` | Active le support ESM dans Jest (voir section 5). |
| `jest` | Lance Jest. |
| `--runInBand` | Exécute les tests **en série** (un après l'autre), pas en parallèle. C'est obligatoire avec SQLite qui ne supporte pas bien les accès concurrents. Avec PostgreSQL on pourrait s'en passer. |
| `--watch` | (uniquement pour `test:watch`) Relance automatiquement les tests à chaque modification d'un fichier. |

**Comment lancer les tests :**

```bash
npm test              # Lance tous les tests une fois
npm run test:watch    # Mode surveillance : relance à chaque sauvegarde
```

---

## 9. Écrire les tests

### Structure commune à tous les fichiers

Chaque fichier de test suit le même squelette :

```javascript
import request from 'supertest';        // Pour faire des appels HTTP
import app from '../src/app.js';        // Notre application Express
import { clearDatabase, prisma } from './helpers/db.js';
import { createUser } from './helpers/auth.js';

afterAll(() => prisma.$disconnect());   // Ferme la connexion Prisma à la fin
beforeEach(clearDatabase);              // Nettoie la base avant chaque test

describe('NOM DU GROUPE', () => {
  it('description du cas testé', async () => {
    // Arrange : préparer les données
    // Act : faire l'appel HTTP
    // Assert : vérifier le résultat
  });
});
```

La structure **Arrange / Act / Assert** (AAA) est une convention universelle en test :
- **Arrange** : mettre en place le contexte (créer un user, un livre…)
- **Act** : exécuter l'action qu'on teste (faire l'appel HTTP)
- **Assert** : vérifier que le résultat est celui attendu (`expect(...)`)

---

### 9a. `tests/auth.test.js`

Ce fichier teste toutes les routes d'authentification.

```javascript
const BASE = '/api/auth';
const USER = { nom: 'Alice', email: 'alice@test.com', password: 'Password123!' };
```

On définit des constantes en haut du fichier pour ne pas répéter les données partout.

**Exemple de test :**

```javascript
it('retourne token + refreshToken', async () => {
  const res = await request(app).post(`${BASE}/login`).send({
    email: USER.email,
    password: USER.password,
  });
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
  expect(res.body.refreshToken).toBeDefined();
});
```

`toBeDefined()` vérifie que la valeur n'est pas `undefined` — on ne vérifie pas la valeur exacte du token (impossible à prédire), juste qu'il existe.

**Ce qu'on teste :**

| Scénario | Résultat attendu |
|---|---|
| Inscription valide | 201, retourne les infos sans le mot de passe |
| Email déjà utilisé | 409 Conflict |
| Données invalides (pas d'email) | 400 Bad Request |
| Connexion avec bons identifiants | 200, token + refreshToken |
| Mauvais mot de passe | 401 Unauthorized |
| Email inconnu | 401 Unauthorized |
| GET /me avec token valide | 200, retourne le profil |
| GET /me sans token | 401 Unauthorized |
| POST /refresh avec bon refreshToken | 200, nouveaux tokens |
| POST /refresh avec token bidon | 403 Forbidden |

---

### 9b. `tests/livres.test.js`

Ce fichier teste la gestion du catalogue et des exemplaires physiques.

```javascript
const LIVRE = { titre: 'Dune', auteur: 'Frank Herbert', annee: 1965 };
```

**Pattern "setup dans beforeEach" :**

```javascript
describe('Exemplaires', () => {
  let admin, livreId;

  beforeEach(async () => {
    admin = await createUser({ role: 'admin' });
    const res = await request(app)
      .post('/api/livres')
      .set('Authorization', admin.authHeader)
      .send(LIVRE);
    livreId = res.body.id;
  });

  it('ajoute un exemplaire (admin) -> 201', async () => {
    // admin et livreId sont déjà disponibles ici
  });
});
```

Quand plusieurs tests d'un même groupe partagent le même contexte initial, on met la création dans `beforeEach`. Ça évite de répéter la création du livre dans chaque test.

**Ce qu'on teste :**

| Scénario | Résultat attendu |
|---|---|
| GET /api/livres | 200, tableau vide |
| POST /api/livres authentifié | 201, livre créé |
| POST /api/livres sans auth | 401 |
| POST /api/livres body invalide | 400 |
| DELETE admin | 204 |
| DELETE non-admin | 403 |
| POST exemplaire (admin) | 201, codeBarre + statut DISPONIBLE |
| POST exemplaire (user) | 403 |
| GET exemplaires d'un livre | 200, liste |
| POST exemplaire livre inexistant | 404 |

---

### 9c. `tests/emprunts.test.js`

Ce fichier teste la logique métier des emprunts, y compris le **mécanisme de switch**.

**La fonction helper locale `setupLivreEtExemplaire` :**

```javascript
const setupLivreEtExemplaire = async (admin) => {
  const livreRes = await request(app)
    .post('/api/livres')
    .set('Authorization', admin.authHeader)
    .send({ titre: 'Le Petit Prince', auteur: 'Saint-Exupery' });

  const exRes = await request(app)
    .post(`/api/livres/${livreRes.body.id}/exemplaires`)
    .set('Authorization', admin.authHeader)
    .send({ codeBarre: 'EX-001' });

  return { livreId: livreRes.body.id, exemplaireId: exRes.body.id };
};
```

Cette fonction crée en une seule fois tout le contexte nécessaire pour tester un emprunt. Elle est locale à ce fichier car les autres fichiers de test en ont une version similaire.

**Le test le plus important : le switch réservation → emprunt :**

```javascript
it("laisse l'exemplaire en RESERVE si une reservation active existe (switch)", async () => {
  const admin = await createUser({ role: 'admin' });
  const userA = await createUser({ suffix: 'A' });
  const userB = await createUser({ suffix: 'B' });
  const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

  // userA emprunte
  const emprunt = await request(app)
    .post('/api/emprunts')
    .set('Authorization', userA.authHeader)
    .send({ exemplaireIds: [exemplaireId] });

  // userB réserve (tous les exemplaires sont empruntés)
  await request(app)
    .post('/api/reservations')
    .set('Authorization', userB.authHeader)
    .send({ livreId });

  // userA rend l'exemplaire
  await request(app)
    .patch(`/api/emprunts/${emprunt.body.id}/retourner`)
    .set('Authorization', userA.authHeader);

  // L'exemplaire doit être RESERVE (pas DISPONIBLE) car userB attend
  const ex = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
  expect(ex.statut).toBe('RESERVE');
});
```

Ce test vérifie directement en base de données (`prisma.exemplaire.findUnique`) ce que l'API ne retourne pas forcément dans sa réponse. **C'est ça la puissance des tests d'intégration : on peut vérifier l'état interne de la base.**

---

### 9d. `tests/reservations.test.js`

Le fichier le plus complexe. Il teste le cycle de vie complet d'une réservation.

**Scénario "honorer une réservation" :**

```javascript
it('convertit la reservation en emprunt et met exemplaire EMPRUNTE', async () => {
  // Mise en place
  const admin = await createUser({ role: 'admin' });
  const userA = await createUser({ suffix: 'A' });
  const userB = await createUser({ suffix: 'B' });
  const { livreId, exemplaireId } = await setupLivreEtExemplaire(admin);

  // 1. userA emprunte l'exemplaire
  const empruntA = await request(app)
    .post('/api/emprunts')
    .set('Authorization', userA.authHeader)
    .send({ exemplaireIds: [exemplaireId] });

  // 2. userB réserve (l'exemplaire est emprunté, donc ok)
  const reservation = await request(app)
    .post('/api/reservations')
    .set('Authorization', userB.authHeader)
    .send({ livreId });

  // 3. userA rend l'exemplaire → il passe RESERVE automatiquement
  await request(app)
    .patch(`/api/emprunts/${empruntA.body.id}/retourner`)
    .set('Authorization', userA.authHeader);

  // 4. userB "honore" sa réservation → ça crée un emprunt
  const res = await request(app)
    .post(`/api/reservations/${reservation.body.id}/honorer`)
    .set('Authorization', userB.authHeader);

  // Vérifications
  expect(res.status).toBe(201);
  expect(res.body.statut).toBe('EN_COURS');
  expect(res.body.exemplaires[0].exemplaireId).toBe(exemplaireId);

  // La réservation est maintenant HONOREE en base
  const resDB = await prisma.reservation.findUnique({ where: { id: reservation.body.id } });
  expect(resDB.statut).toBe('HONOREE');

  // L'exemplaire est EMPRUNTE
  const ex = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
  expect(ex.statut).toBe('EMPRUNTE');
});
```

Ce test raconte une **histoire réelle** : deux utilisateurs, un livre, une réservation, un retour, une conversion. C'est exactement ce qui se passe dans une vraie bibliothèque.

---

## 10. Pourquoi on dit que c'est "automatisable" ?

### Aujourd'hui

Tu lances `npm test` manuellement dans ton terminal. Les 38 tests s'exécutent en ~15 secondes.

### Demain avec GitHub Actions

Tu peux créer un fichier `.github/workflows/tests.yml` :

```yaml
name: Tests

on: [push, pull_request]  # À chaque push ou pull request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npx prisma generate
      - run: npm test
        env:
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          REFRESH_SECRET: ${{ secrets.REFRESH_SECRET }}
```

**Ce que ça fait :** à chaque fois que tu (ou un collègue) `git push`, GitHub lance automatiquement les 38 tests sur un serveur distant. Si un test échoue, GitHub t'envoie un email et bloque la pull request.

**Conséquence concrète :**
- Tu ne peux plus merger du code cassé par accident.
- Si tu casses quelque chose en refactorisant, tu le sais immédiatement.
- La base de code reste toujours dans un état fonctionnel.

C'est ça le vrai sens de "automatisable" : **les tests ne dépendent plus de toi pour être lancés**.

---

## 11. Les pièges à éviter

Voici les erreurs concrètes qu'on a rencontrées en mettant en place ces tests, pour que tu ne les reproduises pas.

### Piège 1 : Les apostrophes françaises dans les chaînes de test

```javascript
// ❌ CASSÉ — l'apostrophe dans "l'exemplaire" termine la chaîne JS
it('refuse si l'exemplaire est deja EMPRUNTE', () => { ... });

// ✓ OK — guillemets doubles pour les descriptions avec apostrophes
it("refuse si l'exemplaire est deja EMPRUNTE", () => { ... });
```

### Piège 2 : Le rate limiter en test

Notre API a un rate limiter sur les routes auth (5 requêtes / 15 min). Les tests font des dizaines de requêtes : ils seraient bloqués.

**Solution :** dans `src/routes/authRoutes.js`, on ajoute `skip` :

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: () => process.env.NODE_ENV === 'test',  // ← désactivé en test
  message: { message: "Trop de tentatives, réessayez dans 15 minutes." }
});
```

Et dans le script de test, on passe `NODE_ENV=test`.

### Piège 3 : Le chemin de la base de données de test

```
DATABASE_URL=file:./test.db
```

Ce chemin est **relatif à `prisma/schema.prisma`**, pas à la racine du projet. Donc :
- `file:./test.db` → crée `prisma/test.db` ✓
- `file:./prisma/test.db` → créerait `prisma/prisma/test.db` ✗

### Piège 4 : Client Prisma désynchronisé du schema

Si tu modifies `prisma/schema.prisma` (ajouter/supprimer un champ), tu dois **regénérer le client Prisma** :

```bash
npx prisma generate
```

Sans ça, le client (dans `node_modules`) a une version ancienne du schema. Il va essayer d'accéder à des colonnes qui n'existent pas dans ta base de données et les tests échouent avec une erreur 500.

### Piège 5 : `runInBand` seulement en CLI, pas dans `jest.config.js`

`--runInBand` est un **flag CLI**, pas une option de configuration. Ne pas écrire :

```javascript
// jest.config.js
export default {
  runInBand: true, // ❌ Ignoré silencieusement !
};
```

Il faut l'inclure directement dans la commande dans `package.json` :

```json
"test": "... jest --runInBand"
```

### Piège 6 : L'ordre de suppression dans `clearDatabase`

Toujours supprimer dans l'ordre **enfant → parent** (respecter les clés étrangères) :

```javascript
// ✓ Correct
await prisma.reservation.deleteMany();      // référence Exemplaire et User
await prisma.empruntExemplaire.deleteMany(); // référence Emprunt et Exemplaire
await prisma.emprunt.deleteMany();           // référence User
await prisma.exemplaire.deleteMany();        // référence Livre
await prisma.livre.deleteMany();
await prisma.refreshToken.deleteMany();      // référence User
await prisma.user.deleteMany();              // ← parent, en dernier
```

Si tu supprimais `User` en premier, Prisma lèverait une erreur de contrainte FK car les `Reservation` pointent encore vers des `User`.

---

## Récapitulatif : structure finale des fichiers de test

```
tests/
├── globalSetup.cjs          # Crée test.db une fois avant tous les tests
├── helpers/
│   ├── db.js                # clearDatabase() + instance prisma
│   └── auth.js              # createUser() pour créer + connecter un user
├── auth.test.js             # Tests des routes /api/auth/*
├── livres.test.js           # Tests des routes /api/livres/* + exemplaires
├── emprunts.test.js         # Tests des routes /api/emprunts/*
└── reservations.test.js     # Tests des routes /api/reservations/*
```

```
Fichiers modifiés dans le projet :
├── jest.config.js           # Configuration Jest (nouveau)
├── package.json             # Ajout des scripts test et test:watch
└── src/routes/authRoutes.js # Rate limiter désactivé en mode test
```

---

*38 tests, 4 suites, ~15 secondes. Une seule commande : `npm test`.*
