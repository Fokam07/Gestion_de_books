import * as livreService from '../services/livreService.js';
import { z } from 'zod';

const livreSchema = z.object({
  titre: z.string().min(1, "Titre obligatoire"),
  auteur: z.string().min(1, "Auteur obligatoire"),
  annee: z.number().optional(),
  isbn: z.string().optional(),
  editeur: z.string().optional(),
  collection: z.string().optional(),
  imageUrl:   z.string().url("URL invalide").optional(), // ← ajouter

});

export const getLivres = async (_req, res) => {
  const livres = await livreService.getAllLivres();
  res.json(livres);
};

export const getOneLivre = async (req, res, next) => {
  try {
    const livre = await livreService.getOneLivre(req.params.id);
    if (!livre) return res.status(404).json({ message: 'Livre introuvable' });
    res.json(livre);
  } catch (error) {
    next(error);
  }
};

export const postLivre = async (req, res, next) => {
  try {
    const data = livreSchema.parse(req.body);
    const nouveauLivre = await livreService.createLivre(data);
    res.status(201).json(nouveauLivre);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json(error.errors);
    next(error);
  }
};

export const deleteLivre = async (req, res, next) => {
  try {
    await livreService.deleteLivre(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

