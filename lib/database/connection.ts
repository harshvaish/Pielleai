import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// ✅ import everything from your schema
import * as schema from '../../drizzle/schema'; // adjust path if needed

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });

// ✅ pass { schema } to enable typed .query.contracts, .query.events, etc.
export const database = drizzle(pool, { schema });

// Optional type export
export type Database = typeof database;
