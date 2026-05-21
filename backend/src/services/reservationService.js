import prisma from '../db/prisma.js';

const reservationInclude = {
  exemplaire: {
    include: {
      livre: { select: { id: true, titre: true, auteur: true } }
    }
  },
  user: { select: { id: true, nom: true, email: true } }
};

export const creerReservation = async (userId, livreId) => {
  return await prisma.$transaction(async (tx) => {
    const exemplaires = await tx.exemplaire.findMany({
      where: { livreId }
    });

    if (exemplaires.length === 0) throw new Error('LIVRE_SANS_EXEMPLAIRE');

    // Bloquer si au moins un exemplaire est disponible
    const disponibles = exemplaires.filter(e => e.statut === 'DISPONIBLE');
    if (disponibles.length > 0) throw new Error('EXEMPLAIRE_DISPONIBLE');

    // Vérifier que l'user n'a pas déjà une réservation active sur ce livre
    const dejaReserve = await tx.reservation.findFirst({
      where: {
        userId,
        statut: 'ACTIVE',
        exemplaire: { livreId }
      }
    });
    if (dejaReserve) throw new Error('DEJA_RESERVE');

    // Choisir le premier exemplaire EMPRUNTE disponible pour la réservation
    // (pas RESERVE ni MAINTENANCE pour garder la file équitable)
    const cible = exemplaires.find(e => e.statut === 'EMPRUNTE');
    if (!cible) throw new Error('AUCUN_EXEMPLAIRE_RESERVABLE');

    const reservation = await tx.reservation.create({
      data: { userId, exemplaireId: cible.id },
      include: reservationInclude
    });

    // Marquer l'exemplaire comme RESERVE
    await tx.exemplaire.update({
      where: { id: cible.id },
      data: { statut: 'RESERVE' }
    });

    return reservation;
  });
};

// Le SWITCH : convertir une réservation ACTIVE en emprunt
export const honorerReservation = async (reservationId, userId) => {
  return await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: { id: reservationId },
      include: { exemplaire: true }
    });

    if (!reservation) throw new Error('NOT_FOUND');
    if (reservation.userId !== userId) throw new Error('FORBIDDEN');
    if (reservation.statut !== 'ACTIVE') throw new Error('RESERVATION_NON_ACTIVE');
    if (reservation.exemplaire.statut !== 'RESERVE') throw new Error('EXEMPLAIRE_NON_PRET');

    // Créer le nouvel emprunt
    const emprunt = await tx.emprunt.create({
      data: {
        userId,
        exemplaires: {
          create: [{ exemplaireId: reservation.exemplaireId }]
        }
      },
      include: {
        exemplaires: {
          include: {
            exemplaire: {
              include: { livre: { select: { id: true, titre: true, auteur: true } } }
            }
          }
        }
      }
    });

    // Marquer l'exemplaire EMPRUNTE
    await tx.exemplaire.update({
      where: { id: reservation.exemplaireId },
      data: { statut: 'EMPRUNTE' }
    });

    // Clore la réservation
    await tx.reservation.update({
      where: { id: reservationId },
      data: { statut: 'HONOREE' }
    });

    return emprunt;
  });
};

export const annulerReservation = async (reservationId, userId) => {
  return await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) throw new Error('NOT_FOUND');
    if (reservation.userId !== userId) throw new Error('FORBIDDEN');
    if (reservation.statut !== 'ACTIVE') throw new Error('RESERVATION_NON_ACTIVE');

    await tx.reservation.update({
      where: { id: reservationId },
      data: { statut: 'ANNULEE' }
    });

    // Remettre l'exemplaire EMPRUNTE (il était RESERVE pour cette réservation)
    // Vérifier qu'il n'y a pas d'autre réservation active sur cet exemplaire
    const autreReservation = await tx.reservation.findFirst({
      where: { exemplaireId: reservation.exemplaireId, statut: 'ACTIVE' }
    });

    if (!autreReservation) {
      await tx.exemplaire.update({
        where: { id: reservation.exemplaireId },
        // L'exemplaire était RESERVE car emprunté → il redevient EMPRUNTE
        // (il sera mis DISPONIBLE quand l'emprunt en cours sera retourné)
        data: { statut: 'EMPRUNTE' }
      });
    }

    return { message: 'Réservation annulée' };
  });
};

export const getMesReservations = (userId) =>
  prisma.reservation.findMany({
    where: { userId },
    orderBy: { dateReservation: 'desc' },
    include: reservationInclude
  });

export const getAllReservations = () =>
  prisma.reservation.findMany({
    orderBy: { dateReservation: 'desc' },
    include: reservationInclude
  });
