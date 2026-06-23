import { z } from 'zod';
import { config } from 'dotenv';

config();

const EnvSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default('postgres'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_SSL: z.preprocess((val) => val === 'true' || val === '1' || val === true, z.boolean()).default(false),
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  SLOW_QUERY_THRESHOLD_MS: z.coerce.number().int().positive().default(200),
}).refine((data) => data.DATABASE_URL || (data.DB_HOST && data.DB_PORT && data.DB_NAME && data.DB_USER), {
  message: "Either DATABASE_URL or individual DB connection variables (DB_HOST, DB_PORT, DB_NAME, DB_USER) must be provided",
  path: ["DATABASE_URL"]
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n\u274c Invalid environment variables:\n');
  const errors = parsed.error.flatten().fieldErrors;
  Object.entries(errors).forEach(([field, messages]) => {
    console.error(`  ${field}: ${messages.join(', ')}`);
  });
  console.error('\nPlease copy .env.example to .env and fill in the required values.\n');
  process.exit(1);
}

export const env = parsed.data;
