import { z } from 'zod';
import { AppError } from '../utils/AppError.js';

export const ProductQuerySchema = z.object({
  cursor: z.string().optional(),
  snapshotTime: z.string().datetime({ offset: true }).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  category: z.string().max(50).trim().optional(),
  search: z.string().max(100).trim().optional(),
});

export function validateProductQuery(query) {
  const result = ProductQuerySchema.safeParse(query);
  if (!result.success) throw new AppError('Invalid query parameters', 400, 'VALIDATION_ERROR', result.error.flatten().fieldErrors);
  return result.data;
}
