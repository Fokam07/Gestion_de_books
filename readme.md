# 📚 API Bibliothèque Sécurisée - Jour 3

Bienvenue dans la version finale et durcie de l'API de gestion de bibliothèque. Cette version met l'accent sur la **sécurité applicative**, la **gestion des sessions** et la **documentation automatisée**.

---

## 🚀 Fonctionnalités Clés (Focus Sécurité)

### 🔐 Authentification & Autorisation
- **JWT (JSON Web Token)** : Authentification sans état (Stateless).
- **Refresh Token Rotation** : Système de rafraîchissement de session avec hachage en base de données et révocation au logout.
- **RBAC (Role-Based Access Control)** : Middleware d'autorisation gérant les rôles `user` et `admin`.

### 🛡️ Sécurité Applicative
- **Helmet.js** : Protection contre les vulnérabilités HTTP courantes.
- **Rate Limiting** : Limitation drastique des tentatives sur les routes sensibles (`/login`, `/register`).
- **CORS Strict** : Configuration des origines autorisées.
- **Payload Limit** : Limitation de la taille des requêtes JSON à 10kb.
- **Error Handling** : Middleware centralisé masquant les détails techniques (Prisma/DB) en production.

### 📖 Documentation & Qualité
- **Swagger/OpenAPI** : Documentation interactive complète.
- **Validation Zod** : Schémas de validation rigoureux pour toutes les entrées utilisateur.
- **Logging** : Suivi des requêtes via Morgan.

---

## 📡 Accès à la Documentation

L'API est entièrement documentée via Swagger. Vous pouvez tester les endpoints, consulter les schémas de données et les codes de réponse attendus :

👉 **[Consulter la documentation Swagger UI](http://localhost:3000/api-docs)** *(Remplacez par l'URL de déploiement si nécessaire)*

---

## 🛠️ Installation & Lancement

1. **Installation des dépendances**
   ```bash
      npm install
   ```

2. **Lancement de l'API**
   ```bash
      npm run dev 
   ```
