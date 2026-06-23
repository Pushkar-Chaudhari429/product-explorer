import { pool } from '../config/database.js';

export async function healthCheck(req, res) {
  let dbStatus = 'connected', dbLatency = null;
  const start = Date.now();
  try { await pool.query('SELECT 1'); dbLatency = Date.now() - start; }
  catch { dbStatus = 'degraded'; }
  const isHealthy = dbStatus === 'connected';
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    database: { status: dbStatus, latency: dbLatency !== null ? `${dbLatency}ms` : null },
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}
