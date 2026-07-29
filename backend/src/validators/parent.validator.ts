import { z } from 'zod';

export const linkChildSchema = z.object({
  body: z
    .object({
      studentId: z.string().uuid(),
      relation: z.string().max(40).optional(),
    })
    .strict(),
});
