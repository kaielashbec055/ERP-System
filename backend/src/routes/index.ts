import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import studentRoutes from './student.routes';
import parentRoutes from './parent.routes';
import teacherRoutes from './teacher.routes';
import academicRoutes from './academic.routes';
import wellnessRoutes from './wellness.routes';
import safetyRoutes from './safety.routes';
import communicationRoutes from './communication.routes';
import aiRoutes from './ai.routes';
import feeRoutes from './fee.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/parents', parentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/academics', academicRoutes);
router.use('/wellness', wellnessRoutes);
router.use('/safety', safetyRoutes);
router.use('/communication', communicationRoutes);
router.use('/ai', aiRoutes);
router.use('/fees', feeRoutes);
router.use('/admin', adminRoutes);

export default router;
