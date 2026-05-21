import { z } from 'zod';
import * as reservationService from '../services/reservationService.js';

const creerSchema = z.object({
  livreId: z.number().int().positive()
});

export const creerReservation = async (req, res, next) => {
  try {
    const { livreId } = creerSchema.parse(req.body);
    const reservation = await reservationService.creerReservation(req.user.id, livreId);
    res.status(201).json(reservation);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json(error.errors);
    if (error.message === 'LIVRE_SANS_EXEMPLAIRE')
      return res.status(404).json({ message: "Aucun exemplaire pour ce livre" });
    if (error.message === 'EXEMPLAIRE_DISPONIBLE')
      return res.status(409).json({ message: "Un exemplaire est disponible — empruntez-le directement" });
    if (error.message === 'DEJA_RESERVE')
      return res.status(409).json({ message: "Vous avez déjà une réservation active pour ce livre" });
    if (error.message === 'AUCUN_EXEMPLAIRE_RESERVABLE')
      return res.status(409).json({ message: "Aucun exemplaire réservable pour le moment" });
    next(error);
  }
};

export const honorerReservation = async (req, res, next) => {
  try {
    const reservationId = parseInt(req.params.id);
    const emprunt = await reservationService.honorerReservation(reservationId, req.user.id);
    res.status(201).json(emprunt);
  } catch (error) {
    if (error.message === 'NOT_FOUND')
      return res.status(404).json({ message: "Réservation introuvable" });
    if (error.message === 'FORBIDDEN')
      return res.status(403).json({ message: "Cette réservation ne vous appartient pas" });
    if (error.message === 'RESERVATION_NON_ACTIVE')
      return res.status(409).json({ message: "Cette réservation n'est plus active" });
    if (error.message === 'EXEMPLAIRE_NON_PRET')
      return res.status(409).json({ message: "L'exemplaire n'est pas encore disponible pour récupération" });
    next(error);
  }
};

export const annulerReservation = async (req, res, next) => {
  try {
    const reservationId = parseInt(req.params.id);
    const result = await reservationService.annulerReservation(reservationId, req.user.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'NOT_FOUND')
      return res.status(404).json({ message: "Réservation introuvable" });
    if (error.message === 'FORBIDDEN')
      return res.status(403).json({ message: "Cette réservation ne vous appartient pas" });
    if (error.message === 'RESERVATION_NON_ACTIVE')
      return res.status(409).json({ message: "Cette réservation n'est plus active" });
    next(error);
  }
};

export const getMesReservations = async (req, res, next) => {
  try {
    const reservations = await reservationService.getMesReservations(req.user.id);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};
