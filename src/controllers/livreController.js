import * as livreService from '../services/livreService.js';
import { z } from 'zod';

const livreSchema = z.object({
  titre: z.string().min(1, "Titre obligatoire"),
  auteur: z.string().min(1, "Auteur obligatoire"),
  annee: z.number().optional(),
  genre: z.string().optional()
});

export const getLivres = async (req, res) => {
  const livres = await livreService.getAllLivres();
  res.json(livres);
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

export const emprunterLivre = async (req, res, next) => {
  try {
    const emprunt = await livreService.emprunter(parseInt(req.params.id), req.user.id);
    res.json(emprunt);
  } catch (error) {
    if (error.message === 'NOT_AVAILABLE') return res.status(409).json({ message: "Livre déjà emprunté" });
    next(error);
  }
};

export const retournerLivre = async (req, res, next) => {
  try {
    const livre = await livreService.retourner(parseInt(req.params.id));
    res.json(livre);
  } catch (error) {
    next(error);
  }
};