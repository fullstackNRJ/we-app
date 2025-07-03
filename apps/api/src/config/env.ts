import { z } from 'zod';
import dotenv from 'dotenv';
import { join } from 'path';

// Determine which .env file to load
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.dev';
dotenv.config({ path: join(__dirname, '../../', envFile)});

export const env = z
  .object({
    PORT: z.string().default('8787'),
    JWT_SECRET: z.string(),
    MONGO_URI: z.string(),
  })
  .parse(process.env);