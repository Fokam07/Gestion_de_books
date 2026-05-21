import { z } from 'zod';
import * as empruntService from '../services/empruntService.js';

const creerEmpruntSchema = z.object({
  exemplaireIds: z
    .array(z.number().int().positive())
    .min(1, "Au moins un exemplaire est requis")
});

export const creerEmprunt = async (req, res, next) => {
  try {
    const { exemplaireIds } = creerEmpruntSchema.parse(req.body);
    const emprunt = await empruntService.creerEmprunt(req.user.id, exemplaireIds);
    res.status(201).json(emprunt);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json(error.errors);
    if (error.message === 'EXEMPLAIRES_REQUIS')
      return res.status(400).json({ message: "Veuillez fournir au moins un exemplaire" });
    if (error.message === 'EXEMPLAIRE_INTROUVABLE')
      return res.status(404).json({ message: "Un ou plusieurs exemplaires sont introuvables" });
    if (error.message === 'NOT_AVAILABLE')
      return res.status(409).json({
        message: `Exemplaire(s) non disponible(s) : ${error.codes}`
      });
    next(error);
  }
};

export const validerEmprunt = async (req, res, next) => {
  try {
    const empruntId = parseInt(req.params.id);
    const emprunt = await empruntService.validerEmprunt(empruntId);
    res.json(emprunt);
  } catch (error) {
    if (error.message === 'NOT_FOUND')
      return res.status(404).json({ message: "Emprunt introuvable" });
    if (error.message === 'NOT_ATTENTE')
      return res.status(409).json({ message: "Cet emprunt n'est pas en attente de validation" });
    next(error);
  }
};

export const validerRetourAdmin = async (req, res, next) => {
  try {
    const empruntId = parseInt(req.params.id);
    const emprunt = await empruntService.validerRetourAdmin(empruntId);
    res.json(emprunt);
  } catch (error) {
    if (error.message === 'NOT_FOUND')
      return res.status(404).json({ message: "Emprunt introuvable" });
    if (error.message === 'ALREADY_RETURNED')
      return res.status(409).json({ message: "Cet emprunt a déjà été retourné" });
    next(error);
  }
};

export const getMesEmprunts = async (req, res, next) => {
  try {
    const emprunts = await empruntService.getMesEmprunts(req.user.id);
    res.json(emprunts);
  } catch (error) {
    next(error);
  }
};

export const getAllEmprunts = async (req, res, next) => {
  try {
    const emprunts = await empruntService.getAllEmprunts();
    res.json(emprunts);
  } catch (error) {
    next(error);
  }
};
