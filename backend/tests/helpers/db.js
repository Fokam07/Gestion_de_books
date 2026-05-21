import { PrismaClient } from '@prisma/client';

// Prisma client pointant vers test.db (DATABASE_URL défini dans le script de test)
export const prisma = new PrismaClient();

// Supprime toutes les données dans l'ordre correct (contraintes FK)
export const clearDatabase = async () => {
  await prisma.reservation.deleteMany();
  await prisma.empruntExemplaire.deleteMany();
  await prisma.emprunt.deleteMany();
  await prisma.exemplaire.deleteMany();
  await prisma.livre.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
};
