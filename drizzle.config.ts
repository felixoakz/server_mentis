import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/models/User.ts",
  out: "./src/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};
