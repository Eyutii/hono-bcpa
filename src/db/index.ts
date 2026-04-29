import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

const url = process.env.DB_FILE_NAME;

if (!url) {
  throw new Error('DB_FILE_NAME is not set');
}

const client = createClient({ url });

export const db = drizzle(client, { schema });
