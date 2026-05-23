import { Router } from 'express';
import * as promotionController from '../controllers/promotion.controller';

const router = Router();

// Promotion management endpoints

// 1. POST: Tạo promotion mới
router.post('/', promotionController.createPromotion);

// 2. GET: Lấy tất cả promotion hiện tại (chưa hết hạn)
router.get('/active', promotionController.getActivePromotions);

// 3. GET: Lấy promotion active của một quán (MUST BE BEFORE /cafe/:cafeId)
router.get('/cafe/active/:cafeId', promotionController.getCafeActivePromotions);

// 4. GET: Lấy tất cả promotion của một quán (MUST BE BEFORE /:id)
router.get('/cafe/:cafeId', promotionController.getCafePromotions);

// 5. GET: Lấy chi tiết một promotion (MUST BE LAST)
router.get('/:id', promotionController.getPromotionById);

// 6. PUT: Cập nhật promotion
router.put('/:id', promotionController.updatePromotion);

// 7. DELETE: Xóa promotion
router.delete('/:id', promotionController.deletePromotion);

export default router;
