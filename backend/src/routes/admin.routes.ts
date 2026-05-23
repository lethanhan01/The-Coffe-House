import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authenticateToken, adminController.getAdminStats);
router.get('/users', authenticateToken, adminController.getUsers);
router.get('/reports', authenticateToken, adminController.getReports);
router.patch('/reports/:id', authenticateToken, adminController.updateReportStatus);

export default router;
