import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Lấy danh sách reviews của một quán (không cần đăng nhập)
router.get('/', reviewController.getReviewsHandler);

// Phải đăng nhập mới được viết đánh giá
router.post('/', authenticateToken, reviewController.createReviewHandler);

export default router;
