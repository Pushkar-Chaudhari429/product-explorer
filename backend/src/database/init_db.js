import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDatabaseExists() {
  const connectionString = env.DATABASE_URL;
  let targetDbName;
  let defaultDbConfig;
  
  if (connectionString) {
    // Extract database name from connection URL
    const match = connectionString.match(/\/([^/?]+)(\?.*)?$/);
    if (!match) {
      throw new Error('Could not parse database name from DATABASE_URL');
    }
    targetDbName = match[1];
    
    // If the target database is already 'postgres' or on Neon, we don't need to create anything
    if (targetDbName.toLowerCase() === 'postgres' || connectionString.includes('neon.tech')) {
      return targetDbName;
    }
    
    // Create connection string to default 'postgres' database to run CREATE DATABASE
    const defaultDbUrl = connectionString.replace(/\/([^/?]+)(\?.*)?$/, '/postgres$2');
    defaultDbConfig = { connectionString: defaultDbUrl };
  } else {
    targetDbName = env.DB_NAME;
    
    // If the target database is already 'postgres' or on Neon (by host), skip
    if (targetDbName.toLowerCase() === 'postgres' || env.DB_HOST.includes('neon.tech')) {
      return targetDbName;
    }
    
    defaultDbConfig = {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: 'postgres',
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    };
  }
  
  console.log(`Connecting to default 'postgres' database to check/create '${targetDbName}'...`);
  const tempPool = new pg.Pool({
    ...defaultDbConfig,
    ssl: (env.DB_SSL || env.NODE_ENV === 'production' || (env.DATABASE_URL && env.DATABASE_URL.includes('sslmode=require')))
      ? { rejectUnauthorized: false }
      : false,
    connectionTimeoutMillis: 5000,
  });
  
  const client = await tempPool.connect();
  try {
    const checkRes = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [targetDbName]
    );
    
    if (checkRes.rowCount === 0) {
      console.log(`Database '${targetDbName}' does not exist. Creating it now...`);
      await client.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`✅ Database '${targetDbName}' created successfully.`);
    } else {
      console.log(`Database '${targetDbName}' already exists.`);
    }
  } finally {
    client.release();
    await tempPool.end();
  }
  
  return targetDbName;
}

async function initDb() {
  try {
    // 1. Ensure the database itself exists
    const targetDbName = await ensureDatabaseExists();
    console.log(`Proceeding with schema and seed initialization on database: '${targetDbName}'...`);

    // 2. Connect to the target database
    const poolConfig = env.DATABASE_URL
      ? { connectionString: env.DATABASE_URL }
      : {
          host: env.DB_HOST,
          port: env.DB_PORT,
          database: env.DB_NAME,
          user: env.DB_USER,
          password: env.DB_PASSWORD,
        };

    const pool = new pg.Pool({
      ...poolConfig,
      ssl: (env.DB_SSL || env.NODE_ENV === 'production' || (env.DATABASE_URL && env.DATABASE_URL.includes('sslmode=require')))
        ? { rejectUnauthorized: false }
        : false,
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    try {
      // 3. Read schema.sql
      const schemaPath = path.join(__dirname, 'schema.sql');
      console.log(`Reading schema from: ${schemaPath}`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');

      // 4. Execute schema.sql
      console.log('Executing schema.sql...');
      await client.query(schemaSql);
      console.log('✅ Schema executed successfully (Tables & Indexes created)');

      // 5. Check if we already have products
      const countRes = await client.query('SELECT COUNT(*) FROM products');
      const count = parseInt(countRes.rows[0].count, 10);
      console.log(`Current product count: ${count}`);

      if (count === 0) {
        // 6. Read seed.sql
        const seedPath = path.join(__dirname, 'seed.sql');
        console.log(`Reading seed data from: ${seedPath}`);
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Executing seed.sql (This inserts 200,000 products, please wait)...');
        const start = Date.now();
        await client.query(seedSql);
        const duration = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`✅ Seed executed successfully in ${duration}s`);
        
        const finalCountRes = await client.query('SELECT COUNT(*) FROM products');
        console.log(`Final product count: ${finalCountRes.rows[0].count}`);
      } else {
        console.log('Database already has products. Skipping seed.');
      }
    } finally {
      client.release();
      await pool.end();
    }

  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
    process.exit(1);
  }
}

initDb();
