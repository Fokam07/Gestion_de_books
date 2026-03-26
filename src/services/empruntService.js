

import prisma from '../db/prisma.js';


const emprunterLivre = async (livreId, userId) => {
    
  return await prisma.$transaction(async (tx) => {
    const livre = await tx.livre.findUnique({ where: { id: livreId } });

    if (!livre || !livre.disponible) {
      throw new Error('NOT_AVAILABLE');
    }

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