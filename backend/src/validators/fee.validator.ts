import { z } from 'zod';

export const studentIdParamSchema = z.object({
  params: z.object({ studentId: z.string().uuid() }),
});

export const createInvoiceSchema = z.object({
  body: z
    .object({
      studentId: z.string().uuid(),
      term: z.string().min(1).max(50),
      description: z.string().max(200).optional(),
      amount: z.number().positive(),
      dueDate: z.string().min(1),
    })
    .strict(),
});

export const payFeeSchema = z.object({
  params: z.object({ studentId: z.string().uuid() }),
  body: z
    .object({
      amount: z.number().positive(),
      method: z.enum(['card', 'bank_transfer', 'cash', 'wallet']).default('card'),
    })
    .strict(),
});
