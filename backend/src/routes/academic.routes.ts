import { Router } from 'express';
import * as academicController from '../controllers/academic.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '@prisma/client';
import {
  assignSubjectTeacherSchema,
  createClassSchema,
  createSubjectSchema,
  enrollStudentSchema,
  upsertSubjectGradeSchema,
} from '../validators/academic.validator';

const router = Router();
router.use(authenticate);

// Readable by any authenticated role (frontend needs class/subject lists in various forms)
router.get('/classes', academicController.listClasses);
router.get('/subjects', academicController.listSubjects);

// Admin-only reference data management
router.post('/classes', authorize(Role.ADMIN), validate(createClassSchema), academicController.createClass);
router.post('/subjects', authorize(Role.ADMIN), validate(createSubjectSchema), academicController.createSubject);
router.post(
  '/class-subjects',
  authorize(Role.ADMIN),
  validate(assignSubjectTeacherSchema),
  academicController.assignSubjectTeacher,
);
router.post(
  '/enrollments',
  authorize(Role.ADMIN),
  validate(enrollStudentSchema),
  academicController.enrollStudent,
);

// Grade entry — teachers grade their own subjects, admins can override.
router.post(
  '/subject-grades',
  authorize(Role.TEACHER, Role.ADMIN),
  validate(upsertSubjectGradeSchema),
  academicController.upsertSubjectGrade,
);

export default router;
