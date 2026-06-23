import * as productRepo from '../repositories/productRepository.js';
import { encodeCursor, decodeCursor } from '../utils/cursorCodec.js';

export async function getSnapshotTime() {
  return productRepo.getSnapshotTime();
}

export async function getProducts({ cursor, snapshotTime, limit, category, search }) {
  const serviceStart = Date.now();
  let result;

  if (!cursor) {
    result = await productRepo.findFirstPage({ snapshotTime, limit, category: category || null, search: search || null });
  } else {
    const decoded = decodeCursor(cursor);
    result = await productRepo.findNextPage({
      snapshotTime, cursorUpdatedAt: decoded.updated_at, cursorId: decoded.id,
      limit, category: category || null, search: search || null,
    });
  }

  const rows = result.rows;
  const hasNextPage = rows.length > limit;
  if (hasNextPage) rows.pop();

  let nextCursor = null;
  if (hasNextPage && rows.length > 0) {
    const last = rows[rows.length - 1];
    nextCursor = encodeCursor(last.updated_at, last.id);
  }

  return {
    products: rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      category: row.category,
      price: row.price,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    })),
    nextCursor,
    hasNextPage,
    queryDuration: Date.now() - serviceStart,
  };
}
