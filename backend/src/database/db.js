import { pool } from '../config/database.js';
import { env } from '../config/env.js';

export async function query(text, params = []) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logQuery({ text, duration, rows: result.rowCount, success: true });
    return result;
  } catch (err) {
    const duration = Date.now() - start;
    logQuery({ text, duration, rows: 0, success: false, error: err.message });
    throw err;
  }
}

function logQuery({ text, duration, rows, success, error }) {
  const isSlow = duration >= env.SLOW_QUERY_THRESHOLD_MS;
  const isProduction = env.NODE_ENV === 'production';
  if (!success) {
    console.error(JSON.stringify({ level: 'ERROR', type: 'DB_QUERY', duration: `${duration}ms`, error, query: text.replace(/\s+/g,' ').trim().substring(0,500) }));
    return;
  }
  if (isSlow) {
    console.warn(`\u26a0\ufe0f  SLOW QUERY: ${duration}ms | ${rows} rows`);
    console.warn(JSON.stringify({ level: 'WARN', type: 'DB_QUERY', duration: `${duration}ms`, rows, threshold: `${env.SLOW_QUERY_THRESHOLD_MS}ms`, query: text.replace(/\s+/g,' ').trim().substring(0,500) }));
    return;
  }
  if (!isProduction) console.log(JSON.stringify({ level: 'INFO', type: 'DB_QUERY', duration: `${duration}ms`, rows }));
}
