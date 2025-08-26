import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/database/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // url: process.env.DATABASE_URL_FOR_INTROSPECT!,
  },
} as Config);
