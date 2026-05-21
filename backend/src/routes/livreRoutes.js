import { Router } from 'express';
import * as livreController from '../controllers/livreController.js';

import * as exemplaireController from '../controllers/exemplaireController.js';
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
router.get('/:id', livreController.getOneLivre);
router.delete('/:id', authenticate, authorize('admin'), livreController.deleteLivre);

/**
 * @swagger
 * /api/livres/{livreId}/exemplaires:
 *   get:
 *     summary: Liste les exemplaires d'un livre
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: path
 *         name: livreId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès
 *   post:
 *     summary: Ajouter un exemplaire à un livre (admin)
 *     tags: [Exemplaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: livreId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codeBarre
 *             properties:
 *               codeBarre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exemplaire créé
 */
router.get('/:livreId/exemplaires', exemplaireController.getExemplaires);
router.post('/:livreId/exemplaires', authenticate, authorize('admin'), exemplaireController.creerExemplaire);

/**
 * @swagger
 * /api/exemplaires/{id}/statut:
 *   patch:
 *     summary: Changer le statut d'un exemplaire (admin)
 *     tags: [Exemplaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [DISPONIBLE, EMPRUNTE, RESERVE, MAINTENANCE]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/exemplaires/:id/statut', authenticate, authorize('admin'), exemplaireController.updateStatut);

export default router;