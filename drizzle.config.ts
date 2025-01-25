import { constants } from './src/configs/constants';

export default {
  schema: "./src/models/**/*.ts",
  out: "./src/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: constants.db.host,
    user: constants.db.username,
    password: constants.db.password,
    database: constants.db.name,
  },
};
