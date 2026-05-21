import { Router } from 'express';
import * as empruntController from '../controllers/empruntController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = Router();

router.post('/', authenticate, empruntController.creerEmprunt);
router.get('/', authenticate, authorize('admin'), empruntController.getAllEmprunts);
router.get('/mes-emprunts', authenticate, empruntController.getMesEmprunts);

// Admin : valider la prise en charge (ATTENTE → EN_COURS)
router.patch('/:id/valider', authenticate, authorize('admin'), empruntController.validerEmprunt);

// Admin : valider le retour physique (EN_COURS → RETOURNE)
router.patch('/:id/retourner', authenticate, authorize('admin'), empruntController.validerRetourAdmin);

export default router;
