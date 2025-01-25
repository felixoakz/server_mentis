import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { constants } from "../configs/constants";

const connection = await mysql.createConnection({
  host: constants.db.host,
  port: constants.db.port,
  user: constants.db.username,
  password: constants.db.password,
  database: constants.db.name,
});

export const db = drizzle(connection);
