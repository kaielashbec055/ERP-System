import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '@prisma/client';
import {
  classIdParamSchema,
  createAssignmentSchema,
  gradeSubmissionSchema,
  markAttendanceSchema,
} from '../validators/teacher.validator';

const router = Router();
router.use(authenticate, authorize(Role.TEACHER));

router.get('/me/classes', teacherController.getMyClasses);
router.get('/me/classes/:classId/roster', validate(classIdParamSchema), teacherController.getClassRoster);
router.get('/me/classes/:classId/metrics', validate(classIdParamSchema), teacherController.getClassMetrics);
router.post(
  '/me/classes/:classId/attendance',
  validate(markAttendanceSchema),
  teacherController.markAttendance,
);

router.get('/me/assignments', teacherController.listMyAssignments);
router.post('/me/assignments', validate(createAssignmentSchema), teacherController.createAssignment);
router.patch(
  '/me/submissions/:submissionId/grade',
  validate(gradeSubmissionSchema),
  teacherController.gradeSubmission,
);

export default router;
