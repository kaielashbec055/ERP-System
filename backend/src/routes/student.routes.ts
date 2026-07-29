import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '@prisma/client';
import { submitAssignmentSchema } from '../validators/student.validator';

const router = Router();
router.use(authenticate, authorize(Role.STUDENT));

router.get('/me/subjects', studentController.getMySubjects);
router.get('/me/assignments', studentController.getMyAssignments);
router.post(
  '/me/assignments/:assignmentId/submit',
  validate(submitAssignmentSchema),
  studentController.submitMyAssignment,
);
router.get('/me/badges', studentController.getMyBadges);
router.get('/me/dashboard-summary', studentController.getMyDashboardSummary);

export default router;
