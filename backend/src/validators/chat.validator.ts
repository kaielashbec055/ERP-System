import { z } from 'zod';

export const startConversationSchema = z.object({
  body: z.object({ otherUserId: z.string().uuid() }).strict(),
});

export const conversationIdParamSchema = z.object({
  params: z.object({ conversationId: z.string().uuid() }),
});

export const sendMessageSchema = z.object({
  params: z.object({ conversationId: z.string().uuid() }),
  body: z
    .object({
      text: z.string().min(1).max(4000),
      attachmentUrl: z.string().url().optional(),
    })
    .strict(),
});
