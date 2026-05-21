
## Route /register - POST - Inscription d'un nouvel utilisateur

Fichier app.js
import authRoutes from ./routes/authRoutes
app.use('/api/auth',authRoutes)


Fichier routes/authRoute.js

*initialisation du router qui nous permet de definir nos routes* 

import { Router } from 'express'

const router = Router()


> syntaxe d une routes   
> router.post(/pathRoute, middleware, controller)


router.post('/register',)


export default router // nous permet de l importer dans app.js sous n importe quel nom de notre choix ( authRoutes ) 
 


 Je suis  etudiant en master et on a vu la conception d'api securise  avec 
    [Introduction aux bases de données avec SQLite](#2-introduction-aux-bases-de-données-avec-sqlite)
    [ORM avec Prisma](#3-orm-avec-prisma)
    [Validation des données avec Zod](#4-validation-des-données-avec-zod)
    [Authentification JWT](#5-authentification-jwt)
    [Middleware d'authentification](#6-middleware-dauthentification)
    [Hachage de mots de passe avec bcrypt](#7-hachage-de-mots-de-passe-avec-bcrypt)
    [Architecture en couches (Controller / Service / Repository)](#1-rappel-express--jwt-bcrypt--middlewares-jour-2)
    [Helmet — Headers HTTP de sécurité](#2-helmet--headers-http-de-sécurité)
    [CORS avancé](#3-cors-avancé)
    [Rate limiting & protection brute-force](#4-rate-limiting--protection-brute-force)
    [Injections & validation avancée](#5-injections--validation-avancée)
    [Gestion sécurisée des erreurs](#6-gestion-sécurisée-des-erreurs)
    [Refresh tokens](#7-refresh-tokens)
    [Audit & durcissement des dépendances](#8-audit--durcissement-des-dépendances)
    [Logging sécurisé](#9-logging-sécurisé)
    [Documentation avec Swagger/OpenAPI](#10-documentation-avec-swaggeropenapi)
    [Déploiement](#11-déploiement)
Je voudrais que , ensemble construsion une api securisé pour que je puisse mieux ancrer les notions vu dans de cours.
bien que ce cour a ete vu dans un contexte academique, je voudrai que l api que nous construirons soit professionnelles et pourquoi pas utilisable pas les frontend qui souhaite l utiliser pour devellopper leur plateforme 



docker exec -it [nom_du_conteneur_front] nc -zv [ip_ou_nom_db] 3306 

# verification zero-trust 

FrontEnd ------> BD 


FrontEnd ------> BackEnd 
BackEnd  ------> BD 


j'aimerais passer a un niveau encore plus haut . niveau pro : 
 - separation de livres et exemplaire parceque en realite un livre a plusieurs exemplaire 
 Exemple : 
    model Exemplaire {
        id            Int       @id @default(autoincrement())

        codeBarre     String    @unique

        livreId       Int
        livre         Livre     @relation(fields: [livreId], references: [id])

        statut        ExemplaireStatus @default(DISPONIBLE)

        emprunts      Emprunt[]
        reservations  Reservation[]

        createdAt     DateTime @default(now())
    }
    enum ExemplaireStatus {
        DISPONIBLE
        EMPRUNTE
        RESERVE
        MAINTENANCE
    }

    - ajout de reservation :  Une vraie bibliothèque nécessite une table Reservation.
    pourquoi : Si tous les exemplaires sont empruntés un autre utilisateur veut le livre  il doit : - pouvoir faire une réservation 
        Exemple : 
            model Reservation {
                id            Int       @id @default(autoincrement())

                userId        Int
                exemplaireId  Int

                statut        ReservationStatus @default(ACTIVE)

                dateReservation DateTime @default(now())
                expirationDate  DateTime?

                user          User        @relation(fields: [userId], references: [id])
                exemplaire    Exemplaire  @relation(fields: [exemplaireId], references: [id])

                createdAt     DateTime @default(now())
            }     

            enum ReservationStatus {
                ACTIVE
                HONOREE
                ANNULEE
                EXPIREE
            }     
    - faire un switch entre reservation et emprunt 

    npx prisma migrate dev --name exemplaire_reservation --force-reset 2>&1 || npx prisma db push --force-reset 2>&1



# Etape pour effectuer la Mise de Jest et supertest 

Installer jest + supertest
Configurer jest.config.js + globalSetup + helpers
Ecrire tests/auth.test.js
Ecrire tests/livres.test.js
Ecrire tests/emprunts.test.js
Ecrire tests/reservations.test.js (flux switch complet)
Lancer les tests et corriger les échecs


    installation de Jest et de supertest pour les Test 
    Edition tu fichier jest.config.ts 
    Edition du fichier globalSetup.cjs
    Creation du folder tests/helpers
    Ajout des Scripts de Test dans le fichier package.json 