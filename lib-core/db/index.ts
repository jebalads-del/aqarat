import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// تصدير الأنواع للمساعدة في التطوير
export type Database = typeof db;
export type Schema = typeof schema;
