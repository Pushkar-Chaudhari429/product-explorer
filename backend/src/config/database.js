import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

const poolConfig = env.DATABASE_URL
  ? { connectionString: env.DATABASE_URL }
  : {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    };

export const pool = new Pool({
  ...poolConfig,
  ssl: (env.DB_SSL || env.NODE_ENV === 'production' || (env.DATABASE_URL && env.DATABASE_URL.includes('sslmode=require')))
    ? { rejectUnauthorized: false }
    : false,
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected idle client error:', err.message);
});

export async function testConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    return true;
  } finally {
    client.release();
  }
}
