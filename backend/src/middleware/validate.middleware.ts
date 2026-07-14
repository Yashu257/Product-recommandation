import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Validates req.body, req.params, and req.query against a Zod schema.
 * Returns 422 with field-level errors on failure.
 */
export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      req.body   = parsed.body   ?? req.body;
      req.params = parsed.params ?? req.params;
      req.query  = parsed.query  ?? req.query;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: err.errors.map((e) => ({
            field: e.path.slice(1).join('.'), // strip leading 'body'/'params'/'query'
            message: e.message,
          })),
        });
        return;
      }
      next(err);
    }
  };
}
