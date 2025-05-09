import { sql } from '@vercel/postgres';
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from './schema';
import { cwd } from 'node:process';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(cwd());


export const db = drizzle(sql, { schema });