import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as chatService from '../services/chat.service';
import { uploadBufferToCloudinary } from '../config/cloudinary';
import { AppError } from '../utils/AppError';

export const listMyConversations = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await chatService.listMyConversations(req.user!.id), 'Conversations fetched.');
});

export const startConversation = asyncHandler(async (req: Request, res: Response) => {
  const convo = await chatService.getOrCreateConversation(req.user!.id, req.body.otherUserId);
  sendCreated(res, convo, 'Conversation ready.');
});

export const listMessages = asyncHandler(async (req: Request, res: Response) => {
  const messages = await chatService.listMessages(req.params.conversationId, req.user!.id);
  sendSuccess(res, messages, 'Messages fetched.');
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await chatService.sendMessage(
    req.params.conversationId,
    req.user!.id,
    req.body.text,
    req.body.attachmentUrl,
  );
  sendCreated(res, message, 'Message sent.');
});

export const sendAttachment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw AppError.badRequest('No file uploaded. Attach a file under field "file".');
  const { url } = await uploadBufferToCloudinary(req.file.buffer, 'chat-attachments', req.user!.id);
  const text = (req.body.text as string | undefined) || '📎 Attachment';
  const message = await chatService.sendMessage(req.params.conversationId, req.user!.id, text, url);
  sendCreated(res, message, 'Attachment sent.');
});

export const listContacts = asyncHandler(async (req: Request, res: Response) => {
  const contacts = await chatService.listContacts(req.user!.id, req.user!.role);
  sendSuccess(res, contacts, 'Contacts fetched.');
});
