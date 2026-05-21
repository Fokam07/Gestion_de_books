import { Router } from 'express';
import * as reservationController from '../controllers/reservationController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = Router();

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Réserver un livre (si tous les exemplaires sont empruntés)
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - livreId
 *             properties:
 *               livreId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Réservation créée
 *       409:
 *         description: Un exemplaire est disponible — empruntez directement
 *   get:
 *     summary: Toutes les réservations (admin)
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 */
router.post('/', authenticate, reservationController.creerReservation);
router.get('/', authenticate, authorize('admin'), reservationController.getAllReservations);

/**
 * @swagger
 * /api/reservations/mes-reservations:
 *   get:
 *     summary: Mes réservations
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 */
router.get('/mes-reservations', authenticate, reservationController.getMesReservations);

/**
 * @swagger
 * /api/reservations/{id}/honorer:
 *   post:
 *     summary: Convertir une réservation en emprunt (le switch)
 *     description: À appeler quand l'exemplaire réservé est disponible (statut RESERVE). Crée automatiquement un nouvel emprunt.
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Emprunt créé depuis la réservation
 *       409:
 *         description: L'exemplaire n'est pas encore disponible
 * /api/reservations/{id}:
 *   delete:
 *     summary: Annuler une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réservation annulée
 */
router.post('/:id/honorer', authenticate, reservationController.honorerReservation);
router.delete('/:id', authenticate, reservationController.annulerReservation);

export default router;
