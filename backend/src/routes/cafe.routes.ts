import { Router } from 'express';
import * as cafeController from '../controllers/cafe.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', cafeController.getCafes);
router.get('/search', cafeController.searchCafes);
router.get('/:id', cafeController.getCafeById);
router.post('/', cafeController.createCafe);
router.post('/:id/request-deletion', authenticateToken, cafeController.requestCafeDeletion);
router.put('/:id', cafeController.updateCafe);
router.delete('/:id', cafeController.deleteCafe);

export default router;
