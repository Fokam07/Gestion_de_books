import prisma from '../db/prisma.js';

export const getAllLivres = () => prisma.livre.findMany();

export const getLivreById = (id) => prisma.livre.findUnique({ where: { id: parseInt(id) } });

export const createLivre = (data) => prisma.livre.create({ data });

export const updateLivre = (id, data) => 
  prisma.livre.update({ where: { id: parseInt(id) }, data });

export const deleteLivre = (id) => 
  prisma.livre.delete({ where: { id: parseInt(id) } });

// Logique d'emprunt (Section 4 du barème)
export const emprunter = async (livreId, userId) => {
  return await prisma.$transaction(async (tx) => {
    const livre = await tx.livre.findUnique({ where: { id: livreId } });

    if (!livre) throw new Error('NOT_FOUND');
    if (!livre.disponible) throw new Error('NOT_AVAILABLE');

    const emprunt = await tx.emprunt.create({
      data: { livreId, userId }
    });

    await tx.livre.update({
      where: { id: livreId },
      data: { disponible: false }
    });

    return emprunt;
  });
};

export const retourner = async (livreId) => {
  return await prisma.$transaction(async (tx) => {
    const dernierEmprunt = await tx.emprunt.findFirst({
      where: { livreId, dateRetour: null },
      orderBy: { dateEmprunt: 'desc' }
    });

    if (!dernierEmprunt) throw new Error('NO_ACTIVE_LOAN');

    await tx.emprunt.update({
      where: { id: dernierEmprunt.id },
      data: { dateRetour: new Date() }
    });

    return await tx.livre.update({
      where: { id: livreId },
      data: { disponible: true }
    });
  });
};