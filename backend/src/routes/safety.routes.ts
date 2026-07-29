import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';

import * as busController from '../controllers/bus.controller';
import * as gatePassController from '../controllers/gatepass.controller';
import * as emergencyController from '../controllers/emergency.controller';

import {
  busIdParamSchema,
  createBusSchema,
  markStopPassedSchema,
  updateBusLiveStatusSchema,
} from '../validators/bus.validator';
import {
  createGatePassSchema,
  updateGatePassStatusSchema,
  broadcastEmergencyAlertSchema,
  resolveEmergencyAlertSchema,
} from '../validators/safety.validator';
import { studentIdParamSchema } from '../validators/student.validator';

const router = Router();
router.use(authenticate);

// --- Bus tracking -----------------------------------------------------------
router.get('/bus/:busId', validate(busIdParamSchema), busController.getBus);
router.get('/bus', authorize(Role.ADMIN, Role.TEACHER), busController.listBuses);
router.post('/bus', authorize(Role.ADMIN), validate(createBusSchema), busController.createBus);
router.patch(
  '/bus/:busId/live-status',
  authorize(Role.ADMIN, Role.TEACHER),
  validate(updateBusLiveStatusSchema),
  busController.updateBusLiveStatus,
);
router.patch(
  '/bus/:busId/stops/:stopId',
  authorize(Role.ADMIN, Role.TEACHER),
  validate(markStopPassedSchema),
  busController.markStopPassed,
);
router.get(
  '/bus/for-child/:studentId',
  authorize(Role.PARENT, Role.ADMIN, Role.TEACHER),
  validate(studentIdParamSchema),
  busController.getBusForChild,
);

// --- Digital Gate Passes -----------------------------------------------------
router.get('/gate-passes', gatePassController.listGatePasses);
router.post(
  '/gate-passes',
  authorize(Role.PARENT, Role.ADMIN),
  validate(createGatePassSchema),
  gatePassController.createGatePass,
);
router.patch(
  '/gate-passes/:id/status',
  authorize(Role.ADMIN),
  validate(updateGatePassStatusSchema),
  gatePassController.updateGatePassStatus,
);

// --- Emergency Alerts / SOS ---------------------------------------------------
router.get('/emergency-alerts', emergencyController.listEmergencyAlerts);
router.post(
  '/emergency-alerts',
  authorize(Role.ADMIN, Role.TEACHER),
  validate(broadcastEmergencyAlertSchema),
  emergencyController.broadcastEmergencyAlert,
);
router.patch(
  '/emergency-alerts/:id/resolve',
  authorize(Role.ADMIN),
  validate(resolveEmergencyAlertSchema),
  emergencyController.resolveEmergencyAlert,
);

export default router;
