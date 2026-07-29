import { Router } from 'express';
import * as wellnessController from '../controllers/wellness.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '@prisma/client';
import {
  addMoodEntrySchema,
  listRiskAlertsQuerySchema,
  resolveRiskAlertSchema,
} from '../validators/wellness.validator';

const router = Router();
router.use(authenticate);

// Student mood check-ins
router.post('/mood', authorize(Role.STUDENT), validate(addMoodEntrySchema), wellnessController.addMyMoodEntry);
router.get('/mood', authorize(Role.STUDENT), wellnessController.getMyMoodEntries);

// AI Early Warning risk alerts — visible to teachers & admins
router.get(
  '/risk-alerts',
  authorize(Role.TEACHER, Role.ADMIN),
  validate(listRiskAlertsQuerySchema),
  wellnessController.listRiskAlerts,
);
router.post(
  '/risk-alerts/generate',
  authorize(Role.TEACHER, Role.ADMIN),
  wellnessController.generateRiskAlerts,
);
router.patch(
  '/risk-alerts/:id/resolve',
  authorize(Role.TEACHER, Role.ADMIN),
  validate(resolveRiskAlertSchema),
  wellnessController.resolveRiskAlert,
);

export default router;
