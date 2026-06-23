import { z } from 'zod';
import { AppError } from './AppError.js';

const CursorPayloadSchema = z.object({
  updated_at: z.string().datetime({ offset: true }),
  id: z.number().int().positive(),
});

export function encodeCursor(updatedAt, id) {
  const payload = JSON.stringify({
    updated_at: updatedAt instanceof Date ? updatedAt.toISOString() : String(updatedAt),
    id: Number(id),
  });
  return Buffer.from(payload, 'utf-8').toString('base64');
}

export function decodeCursor(raw) {
  let decoded, parsed;
  try { decoded = Buffer.from(raw, 'base64').toString('utf-8'); }
  catch { throw new AppError('Cursor is not valid base64', 400, 'INVALID_CURSOR'); }
  try { parsed = JSON.parse(decoded); }
  catch { throw new AppError('Cursor payload is not valid JSON', 400, 'INVALID_CURSOR'); }
  const result = CursorPayloadSchema.safeParse(parsed);
  if (!result.success) throw new AppError('Cursor payload failed validation', 400, 'INVALID_CURSOR', result.error.flatten().fieldErrors);
  return result.data;
}
