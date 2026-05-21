/*
  Warnings:

  - You are about to drop the column `livreId` on the `Emprunt` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "EmpruntLivre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "empruntId" INTEGER NOT NULL,
    "livreId" INTEGER NOT NULL,
    CONSTRAINT "EmpruntLivre_empruntId_fkey" FOREIGN KEY ("empruntId") REFERENCES "Emprunt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmpruntLivre_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "Livre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Emprunt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_COURS',
    "dateEmprunt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateRetour" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Emprunt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Emprunt" ("dateEmprunt", "dateRetour", "id", "userId") SELECT "dateEmprunt", "dateRetour", "id", "userId" FROM "Emprunt";
DROP TABLE "Emprunt";
ALTER TABLE "new_Emprunt" RENAME TO "Emprunt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "EmpruntLivre_empruntId_livreId_key" ON "EmpruntLivre"("empruntId", "livreId");
