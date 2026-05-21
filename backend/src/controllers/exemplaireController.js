import { z } from 'zod';
import * as exemplaireService from '../services/exemplaireService.js';

const creerSchema = z.object({
  codeBarre: z.string().min(1, "Code barre obligatoire")
});

const statutSchema = z.object({
  statut: z.enum(['DISPONIBLE', 'EMPRUNTE', 'RESERVE', 'MAINTENANCE'])
});

export const creerExemplaire = async (req, res, next) => {
  try {
    const livreId = parseInt(req.params.livreId);
    const { codeBarre } = creerSchema.parse(req.body);
    const exemplaire = await exemplaireService.creerExemplaire(livreId, codeBarre);
    res.status(201).json(exemplaire);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json(error.errors);
    if (error.message === 'LIVRE_INTROUVABLE')
      return res.status(404).json({ message: "Livre introuvable" });
    next(error);
  }
};

export const getExemplaires = async (req, res, next) => {
  try {
    const livreId = parseInt(req.params.livreId);
    const exemplaires = await exemplaireService.getExemplairesParLivre(livreId);
    res.json(exemplaires);
  } catch (error) {
    next(error);
  }
};

export const updateStatut = async (req, res, next) => {
  try {
    const exemplaireId = parseInt(req.params.id);
    const { statut } = statutSchema.parse(req.body);
    const exemplaire = await exemplaireService.updateStatut(exemplaireId, statut);
    res.json(exemplaire);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json(error.errors);
    if (error.message === 'EXEMPLAIRE_INTROUVABLE')
      return res.status(404).json({ message: "Exemplaire introuvable" });
    next(error);
  }
};
