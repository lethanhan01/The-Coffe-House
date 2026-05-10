import { Router } from 'express';
import * as cafeController from '../controllers/cafe.controller';

const router = Router();

router.get('/', cafeController.getCafes);
router.get('/search',cafeController.searchCafes)
router.get('/:id', cafeController.getCafeById);
router.post('/', cafeController.createCafe);
router.put('/:id', cafeController.updateCafe);
router.delete('/:id', cafeController.deleteCafe);

export default router;
