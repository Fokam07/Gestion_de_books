import { Router } from 'express';
import * as empruntController from '../controllers/empruntController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = Router();

/**
 * @swagger
 * /api/emprunts:
 *   post:
 *     summary: Emprunter un ou plusieurs livres
 *     tags: [Emprunts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - livreIds
 *             properties:
 *               livreIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Emprunt créé
 *       409:
 *         description: Un ou plusieurs livres déjà empruntés
 *   get:
 *     summary: Liste tous les emprunts (admin)
 *     tags: [Emprunts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 */
router.post('/', authenticate, empruntController.creerEmprunt);
router.get('/', authenticate, authorize('admin'), empruntController.getAllEmprunts);

/**
 * @swagger
 * /api/emprunts/mes-emprunts:
 *   get:
 *     summary: Mes emprunts en cours et passés
 *     tags: [Emprunts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 */
router.get('/mes-emprunts', authenticate, empruntController.getMesEmprunts);

/**
 * @swagger
 * /api/emprunts/{id}/retourner:
 *   patch:
 *     summary: Retourner tous les livres d'un emprunt
 *     tags: [Emprunts]
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
 *         description: Retour enregistré
 *       403:
 *         description: Emprunt non autorisé
 *       409:
 *         description: Déjà retourné
 */
router.patch('/:id/retourner', authenticate, empruntController.retournerEmprunt);

export default router;
