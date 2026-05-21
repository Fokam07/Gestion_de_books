import prisma from '../db/prisma.js';

const empruntInclude = {
  exemplaires: {
    include: {
      exemplaire: {
        include: {
          livre: { select: { id: true, titre: true, auteur: true } }
        }
      }
    }
  },
  user: { select: { id: true, nom: true, email: true } }
};

export const creerEmprunt = async (userId, exemplaireIds) => {
  if (!exemplaireIds || exemplaireIds.length === 0) throw new Error('EXEMPLAIRES_REQUIS');

  return await prisma.$transaction(async (tx) => {
    const exemplaires = await tx.exemplaire.findMany({
      where: { id: { in: exemplaireIds } }
    });

    if (exemplaires.length !== exemplaireIds.length) throw new Error('EXEMPLAIRE_INTROUVABLE');

    const indisponibles = exemplaires.filter(e => e.statut !== 'DISPONIBLE');
    if (indisponibles.length > 0) {
      const err = new Error('NOT_AVAILABLE');
      err.codes = indisponibles.map(e => e.codeBarre).join(', ');
      throw err;
    }

    const emprunt = await tx.emprunt.create({
      data: {
        userId,
        exemplaires: {
          create: exemplaireIds.map(exemplaireId => ({ exemplaireId }))
        }
      },
      include: empruntInclude
    });

    await tx.exemplaire.updateMany({
      where: { id: { in: exemplaireIds } },
      data: { statut: 'EMPRUNTE' }
    });

    return emprunt;
  });
};

export const retournerEmprunt = async (empruntId, userId) => {
  return await prisma.$transaction(async (tx) => {
    const emprunt = await tx.emprunt.findUnique({
      where: { id: empruntId },
      include: { exemplaires: true }
    });

    if (!emprunt) throw new Error('NOT_FOUND');
    if (emprunt.userId !== userId) throw new Error('FORBIDDEN');
    if (emprunt.statut === 'RETOURNE') throw new Error('ALREADY_RETURNED');

    const exemplaireIds = emprunt.exemplaires.map(e => e.exemplaireId);

    // Pour chaque exemplaire : vérifier si une réservation ACTIVE l'attend
    for (const exemplaireId of exemplaireIds) {
      const reservation = await tx.reservation.findFirst({
        where: { exemplaireId, statut: 'ACTIVE' }
      });

      // Switch : si réservation → l'exemplaire reste RESERVE (pas DISPONIBLE)
      // Si pas de réservation → il redevient DISPONIBLE
      await tx.exemplaire.update({
        where: { id: exemplaireId },
        data: { statut: reservation ? 'RESERVE' : 'DISPONIBLE' }
      });
    }

    return await tx.emprunt.update({
      where: { id: empruntId },
      data: { statut: 'RETOURNE', dateRetour: new Date() },
      include: empruntInclude
    });
  });
};

export const getMesEmprunts = (userId) =>
  prisma.emprunt.findMany({
    where: { userId },
    orderBy: { dateEmprunt: 'desc' },
    include: empruntInclude
  });

export const getAllEmprunts = () =>
  prisma.emprunt.findMany({
    orderBy: { dateEmprunt: 'desc' },
    include: empruntInclude
  });
