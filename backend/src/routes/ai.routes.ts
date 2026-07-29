import { Router } from 'express';
import { Role } from '@prisma/client';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { aiChatSchema, homeworkHelpSchema, parentWeeklyReportSchema } from '../validators/ai.validator';

const router = Router();
router.use(authenticate);

// Conversational assistant (floating AI widget) — available to every role
router.post('/chat', validate(aiChatSchema), aiController.chat);
router.get('/chat/history', aiController.getChatHistory);

// Structured analytics endpoints (backend-only, no dedicated AI UI)
router.get('/study-plan', authorize(Role.STUDENT), aiController.studyPlan);
router.post('/homework-help', authorize(Role.STUDENT), validate(homeworkHelpSchema), aiController.homeworkHelp);
router.get('/performance-prediction', authorize(Role.STUDENT), aiController.performancePrediction);
router.get('/wellness-analysis', authorize(Role.STUDENT), aiController.wellnessAnalysis);
router.get(
  '/parent-weekly-report/:studentId',
  authorize(Role.PARENT),
  validate(parentWeeklyReportSchema),
  aiController.parentWeeklyReport,
);
router.get('/student-progress-summary', authorize(Role.STUDENT), aiController.studentProgressSummary);

export default router;
