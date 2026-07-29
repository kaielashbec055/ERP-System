import { Router } from 'express';
import { Role } from '@prisma/client';
import * as feeController from '../controllers/fee.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createInvoiceSchema, payFeeSchema, studentIdParamSchema } from '../validators/fee.validator';

const router = Router();
router.use(authenticate);

router.get(
  '/students/:studentId/invoices',
  authorize(Role.PARENT, Role.ADMIN),
  validate(studentIdParamSchema),
  feeController.listInvoices,
);
router.post('/invoices', authorize(Role.ADMIN), validate(createInvoiceSchema), feeController.createInvoice);
router.post(
  '/students/:studentId/pay',
  authorize(Role.PARENT, Role.ADMIN),
  validate(payFeeSchema),
  feeController.payFees,
);

export default router;
