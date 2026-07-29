import { Router } from 'express';
import { Role } from '@prisma/client';
import * as adminController from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();
router.use(authenticate, authorize(Role.ADMIN));

router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/recent-activity', adminController.getRecentActivity);

export default router;
