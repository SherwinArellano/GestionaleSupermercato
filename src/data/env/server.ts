import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    DB_BASE_URL: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    MONGODB_URI: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
