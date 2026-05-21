import prisma from '../db/prisma.js';

const STATUTS_VALIDES = ['DISPONIBLE', 'EMPRUNTE', 'RESERVE', 'MAINTENANCE'];

export const creerExemplaire = async (livreId, codeBarre) => {
  const livre = await prisma.livre.findUnique({ where: { id: livreId } });
  if (!livre) throw new Error('LIVRE_INTROUVABLE');

  return prisma.exemplaire.create({
    data: { livreId, codeBarre },
    include: { livre: { select: { id: true, titre: true, auteur: true } } }
  });
};

export const getExemplairesParLivre = (livreId) =>
  prisma.exemplaire.findMany({
    where: { livreId },
    orderBy: { createdAt: 'asc' }
  });

export const updateStatut = async (exemplaireId, statut) => {
  if (!STATUTS_VALIDES.includes(statut)) throw new Error('STATUT_INVALIDE');

  const exemplaire = await prisma.exemplaire.findUnique({ where: { id: exemplaireId } });
  if (!exemplaire) throw new Error('EXEMPLAIRE_INTROUVABLE');

  return prisma.exemplaire.update({
    where: { id: exemplaireId },
    data: { statut }
  });
};
