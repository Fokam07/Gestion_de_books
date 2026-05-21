/*
  Warnings:

  - You are about to drop the `EmpruntLivre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `disponible` on the `Livre` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Livre` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "EmpruntLivre_empruntId_livreId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmpruntLivre";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Exemplaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codeBarre" TEXT NOT NULL,
    "livreId" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'DISPONIBLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Exemplaire_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "Livre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmpruntExemplaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "empruntId" INTEGER NOT NULL,
    "exemplaireId" INTEGER NOT NULL,
    CONSTRAINT "EmpruntExemplaire_empruntId_fkey" FOREIGN KEY ("empruntId") REFERENCES "Emprunt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmpruntExemplaire_exemplaireId_fkey" FOREIGN KEY ("exemplaireId") REFERENCES "Exemplaire" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "exemplaireId" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ACTIVE',
    "dateReservation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_exemplaireId_fkey" FOREIGN KEY ("exemplaireId") REFERENCES "Exemplaire" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Livre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "auteur" TEXT NOT NULL,
    "isbn" TEXT,
    "annee" INTEGER,
    "imageUrl" TEXT,
    "editeur" TEXT,
    "collection" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Livre" ("annee", "auteur", "createdAt", "id", "titre", "updatedAt") SELECT "annee", "auteur", "createdAt", "id", "titre", "updatedAt" FROM "Livre";
DROP TABLE "Livre";
ALTER TABLE "new_Livre" RENAME TO "Livre";
CREATE UNIQUE INDEX "Livre_isbn_key" ON "Livre"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Exemplaire_codeBarre_key" ON "Exemplaire"("codeBarre");

-- CreateIndex
CREATE UNIQUE INDEX "EmpruntExemplaire_empruntId_exemplaireId_key" ON "EmpruntExemplaire"("empruntId", "exemplaireId");
