import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';

/**
 * Validates req.body / req.query / req.params against a Zod schema shaped as:
 *   z.object({ body: z.object({...}), query: z.object({...}).optional(), params: z.object({...}).optional() })
 * On success, the parsed (and type-coerced) values are written back onto req.
 */
export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        sendError(
          res,
          'Validation failed',
          422,
          err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
        );
        return;
      }
      next(err);
    }
  };
};
