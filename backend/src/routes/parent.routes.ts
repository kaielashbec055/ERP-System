import { Router } from 'express';
import * as parentController from '../controllers/parent.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '@prisma/client';
import { linkChildSchema } from '../validators/parent.validator';

const router = Router();
router.use(authenticate, authorize(Role.PARENT));

router.get('/me/children', parentController.getMyChildren);
router.post('/me/children', validate(linkChildSchema), parentController.linkChild);

export default router;
