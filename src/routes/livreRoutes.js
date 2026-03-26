import { Router } from 'express';
import * as livreController from '../controllers/livreController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = Router();

/**
 * @swagger
 * /api/livres:
 *   get:
 *     summary: Liste tous les livres
 *     tags: [Livres]
 *     responses:
 *       200:
 *         description: Succès
 *   post:
 *     summary: Ajouter un livre
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - auteur
 *             properties:
 *               titre:
 *                 type: string
 *               auteur:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livre créé
 */
router.get('/', livreController.getLivres);
router.post('/', authenticate, livreController.postLivre);

/**
 * @swagger
 * /api/livres/{id}:
 *   get:
 *     summary: Détail d'un livre
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès
 *   delete:
 *     summary: Supprimer un livre
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimé
 */
router.get('/:id', livreController.getLivres);
router.delete('/:id', authenticate, authorize('admin'), livreController.deleteLivre);

/**
 * @swagger
 * /api/livres/{id}/emprunter:
 *   post:
 *     summary: Emprunter un livre
 *     tags: [Livres]
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
 *         description: Emprunt réussi
 */
router.post('/:id/emprunter', authenticate, livreController.emprunterLivre);

export default router;