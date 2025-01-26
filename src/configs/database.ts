import { drizzle } from 'drizzle-orm/node-postgres';
import { constants } from '../configs/constants';

const db = drizzle(constants.db.databaseUrl);

export { db };
