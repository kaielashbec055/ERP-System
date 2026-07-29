import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { upload } from '../middlewares/upload.middleware';

import * as announcementController from '../controllers/announcement.controller';
import * as notificationController from '../controllers/notification.controller';
import * as chatController from '../controllers/chat.controller';

import {
  createAnnouncementSchema,
  listAnnouncementsQuerySchema,
} from '../validators/announcement.validator';
import {
  conversationIdParamSchema,
  sendMessageSchema,
  startConversationSchema,
} from '../validators/chat.validator';

const router = Router();
router.use(authenticate);

// --- Announcements / Circulars ------------------------------------------------
router.get('/announcements', validate(listAnnouncementsQuerySchema), announcementController.listAnnouncements);
router.post(
  '/announcements',
  authorize(Role.ADMIN, Role.TEACHER),
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement,
);

// --- Notifications -------------------------------------------------------------
router.get('/notifications', notificationController.listMyNotifications);
router.patch('/notifications/:id/read', notificationController.markNotificationRead);
router.patch('/notifications/read-all', notificationController.markAllNotificationsRead);

// --- Chat (1:1 messaging) -------------------------------------------------------
router.get('/chat/contacts', chatController.listContacts);
router.get('/chat/conversations', chatController.listMyConversations);
router.post('/chat/conversations', validate(startConversationSchema), chatController.startConversation);
router.get(
  '/chat/conversations/:conversationId/messages',
  validate(conversationIdParamSchema),
  chatController.listMessages,
);
router.post(
  '/chat/conversations/:conversationId/messages',
  validate(sendMessageSchema),
  chatController.sendMessage,
);
router.post(
  '/chat/conversations/:conversationId/attachments',
  validate(conversationIdParamSchema),
  upload.single('file'),
  chatController.sendAttachment,
);

export default router;
