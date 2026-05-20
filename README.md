# Gestion_de_books
# 📚 Application de Gestion de Bibliothèque

## 📖 Présentation

Cette application permet la gestion complète d’une bibliothèque universitaire ou scolaire.

Le système gère :

- les utilisateurs
- les livres
- les catégories
- les réservations
- les emprunts
- les retours
- les pénalités
- les avis sur les livres

---

# 🎯 Objectifs du Projet

L’objectif est de créer une application moderne permettant :

- la réservation de livres en ligne
- les emprunts directs à la bibliothèque
- la gestion des retards
- le calcul automatique des pénalités
- la gestion du stock des livres
- la gestion des utilisateurs selon leurs rôles

---

# 👥 Rôles du Système

| Rôle | Description |
|---|---|
| ADMIN | Gère toute l’application |
| BIBLIOTHECAIRE | Gère les emprunts et retours |
| ETUDIANT | Consulte et réserve des livres |

---

# 🔐 Fonctionnalités d’Authentification

## Tous les utilisateurs peuvent :
- se connecter
- se déconnecter
- modifier leur mot de passe

---

# 👑 Fonctionnalités Administrateur

## 👥 Gestion des utilisateurs
- ajouter utilisateur
- modifier utilisateur
- supprimer utilisateur
- activer/désactiver compte
- voir profil utilisateur
- rechercher utilisateur
- filtrer utilisateurs

---

## 📚 Gestion des livres
- ajouter livre
- modifier livre
- supprimer livre
- voir détails livre
- gérer stock
- rendre livre disponible/indisponible
- upload image couverture

---

## 🏷️ Gestion des catégories
- ajouter catégorie
- modifier catégorie
- supprimer catégorie

---

## 📊 Dashboard
- nombre total livres
- livres disponibles
- livres empruntés
- réservations
- utilisateurs actifs
- retards
- pénalités
- top livres empruntés

---

# 👩‍💼 Fonctionnalités Bibliothécaire

## 📚 Gestion des emprunts
- créer emprunt direct
- transformer réservation en emprunt
- choisir date limite retour
- voir détails emprunt
- voir historique emprunts

---

## 📦 Gestion des retours
- rechercher utilisateur
- voir emprunts récents
- valider retour
- calcul automatique retard
- calcul automatique pénalité
- remise automatique du stock

---

## 📌 Gestion des réservations
- voir réservations
- transformer réservation
- annuler réservation

---

## 🔍 Recherche
- recherche livre
- recherche utilisateur
- recherche emprunt

---

# 👨‍🎓 Fonctionnalités Étudiant

## 👤 Profil
- voir profil
- modifier profil
- changer mot de passe

---

## 📚 Livres
- consulter catalogue
- voir détails livre
- rechercher livre
- filtrer par catégorie

---

## 📌 Réservations
- réserver livres
- annuler réservation
- voir statut réservation

---

## 📖 Emprunts
- voir emprunts actifs
- voir historique
- voir retards
- voir pénalités

---

## ❤️ Avis
- noter livre
- commenter livre

---

# ⚠️ Règles Métier

## 📚 Emprunts

- maximum 2 livres par emprunt
- maximum 2 livres par réservation

---

## 📦 Disponibilité

Un livre est empruntable uniquement si :

```text
quantiteDisponible > 0
```

---

## ⏰ Retard

Un emprunt est en retard si :

```text
dateRetour > dateLimiteRetour
```

---

## 💰 Pénalité

La pénalité est calculée automatiquement selon le nombre de jours de retard.

---

# 🔄 Workflows du Système

# ✅ Cas 1 — Réservation en ligne

```text
Étudiant réserve livres
        ↓
Réservation EN_ATTENTE
        ↓
Étudiant vient bibliothèque
        ↓
Bibliothécaire transforme réservation en emprunt
        ↓
Stock réduit
```

---

# ✅ Cas 2 — Emprunt direct

```text
Étudiant arrive sans réservation
        ↓
Bibliothécaire recherche utilisateur
        ↓
Sélectionne livres
(maximum 2)
        ↓
Choisit date limite retour
        ↓
Créer emprunt direct
        ↓
Stock réduit
```

---

# ✅ Cas 3 — Retour de livres

```text
Étudiant apporte livres
        ↓
Bibliothécaire ouvre emprunt
        ↓
Valider retour
        ↓
Le système :
- remplit dateRetour
- calcule retard
- calcule pénalité
- remet stock
```

---

# 🧱 MCD (Modèle Conceptuel de Données)

```text
+----------------------+
|     UTILISATEUR      |
+----------------------+
| id_user              |
| nom                  |
| prenom               |
| email                |
| password             |
| role                 |
| actif                |
| createdAt            |
+----------------------+

          1,N
            |
            |
            |
          1,1

+----------------------+
|       EMPRUNT        |
+----------------------+
| id_emprunt           |
| dateEmprunt          |
| dateLimiteRetour     |
| dateRetour           |
| retard               |
| statut               |
| penalite             |
| createdAt            |
| id_user FK           |
| id_reservation FK    |
+----------------------+

          1,N
            |
            |
            |
          1,1

+----------------------+
|    LIVRE_EMPRUNT     |
+----------------------+
| id_livre_emprunt     |
| id_emprunt FK        |
| id_livre FK          |
+----------------------+

          1,1
            |
            |
            |
          0,N

+----------------------+
|        LIVRE         |
+----------------------+
| id_livre             |
| titre                |
| auteur               |
| annee                |
| description          |
| imageUrl             |
| quantite             |
| quantiteDisponible   |
| disponible           |
| createdAt            |
| updatedAt            |
| id_categorie FK      |
+----------------------+

          1,1
            |
            |
            |
          0,N

+----------------------+
|      CATEGORIE       |
+----------------------+
| id_categorie         |
| nom                  |
+----------------------+

+----------------------+
|     RESERVATION      |
+----------------------+
| id_reservation       |
| dateReservation      |
| statut               |
| createdAt            |
| id_user FK           |
+----------------------+

          1,N
            |
            |
            |
          1,1

+----------------------+
|   LIVRE_RESERVATION  |
+----------------------+
| id_livre_reservation |
| id_reservation FK    |
| id_livre FK          |
+----------------------+

+----------------------+
|         AVIS         |
+----------------------+
| id_avis              |
| note                 |
| commentaire          |
| createdAt            |
| id_user FK           |
| id_livre FK          |
+----------------------+
```

---

# 🏗️ MLD (Modèle Logique de Données)

# UTILISATEUR

```text
id_user PK
nom
prenom
email UNIQUE
password
role
actif
createdAt
```

---

# CATEGORIE

```text
id_categorie PK
nom
```

---

# LIVRE

```text
id_livre PK
titre
auteur
annee
description
imageUrl
quantite
quantiteDisponible
disponible
createdAt
updatedAt

id_categorie FK
```

---

# RESERVATION

```text
id_reservation PK
dateReservation
statut
createdAt

id_user FK
```

---

# LIVRE_RESERVATION

```text
id_livre_reservation PK

id_reservation FK
id_livre FK
```

### ⚠️ Contrainte
```text
Maximum 2 livres par réservation
```

---

# EMPRUNT

```text
id_emprunt PK
dateEmprunt
dateLimiteRetour
dateRetour
retard
statut
penalite
createdAt

id_user FK
id_reservation FK NULL
```

### ⚠️ Remarque

```text
id_reservation = NULL
```

signifie :
- emprunt direct sans réservation

---

# LIVRE_EMPRUNT

```text
id_livre_emprunt PK

id_emprunt FK
id_livre FK
```

### ⚠️ Contrainte
```text
Maximum 2 livres par emprunt
```

---

# AVIS

```text
id_avis PK
note
commentaire
createdAt

id_user FK
id_livre FK
```

---

# 📌 Statuts

## Réservation

```text
EN_ATTENTE
TRANSFORMEE
ANNULEE
```

---

## Emprunt

```text
EN_COURS
RETOURNE
EN_RETARD
```

---

# 🚀 Technologies Recommandées

## Frontend
- React.js
- Next.js
- TailwindCSS

---

## Backend
- Node.js
- Express.js ou NestJS

---

## ORM
- Prisma

---

## Base de données
- PostgreSQL

---

## Authentification
- JWT
- Refresh Token

---

# ✅ Résultat Final

Cette application permet :

✅ la gestion complète d’une bibliothèque  
✅ les réservations en ligne  
✅ les emprunts directs  
✅ la gestion automatique des retards  
✅ le calcul automatique des pénalités  
✅ la gestion du stock  
✅ les avis utilisateurs  
✅ une architecture moderne et professionnelle
