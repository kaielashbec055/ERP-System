import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { upload } from '../middlewares/upload.middleware';
import { Role } from '@prisma/client';
import {
  listUsersQuerySchema,
  setActiveStatusSchema,
  updateProfileSchema,
  userIdParamSchema,
} from '../validators/user.validator';

const router = Router();
router.use(authenticate);

router.patch('/me', validate(updateProfileSchema), userController.updateMyProfile);
router.post('/me/avatar', upload.single('avatar'), userController.uploadMyAvatar);

router.get('/:id', validate(userIdParamSchema), userController.getUserProfile);

// --- Admin-only user directory & account management ---
router.get('/', authorize(Role.ADMIN), validate(listUsersQuerySchema), userController.listUsers);
router.patch(
  '/:id/status',
  authorize(Role.ADMIN),
  validate(setActiveStatusSchema),
  userController.setUserActiveStatus,
);

export default router;
