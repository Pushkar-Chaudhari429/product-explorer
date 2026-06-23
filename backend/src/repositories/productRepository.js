import { query } from '../database/db.js';

export async function getSnapshotTime() {
  const result = await query('SELECT NOW() AS snapshot_time');
  return result.rows[0].snapshot_time;
}

export async function findFirstPage({ snapshotTime, limit, category, search }) {
  const sql = `
    SELECT id, name, category, price, created_at, updated_at
    FROM products
    WHERE updated_at <= $1::timestamptz
      AND ($2::text IS NULL OR category = $2)
      AND ($3::text IS NULL OR name ILIKE $3)
    ORDER BY updated_at DESC, id DESC
    LIMIT $4
  `;
  return query(sql, [snapshotTime, category || null, search ? `%${search}%` : null, limit + 1]);
}

export async function findNextPage({ snapshotTime, cursorUpdatedAt, cursorId, limit, category, search }) {
  const sql = `
    SELECT id, name, category, price, created_at, updated_at
    FROM products
    WHERE updated_at <= $1::timestamptz
      AND (updated_at, id) < ($2::timestamptz, $3::bigint)
      AND ($4::text IS NULL OR category = $4)
      AND ($5::text IS NULL OR name ILIKE $5)
    ORDER BY updated_at DESC, id DESC
    LIMIT $6
  `;
  return query(sql, [snapshotTime, cursorUpdatedAt, cursorId, category || null, search ? `%${search}%` : null, limit + 1]);
}
