import { cleanEnv, str, num } from 'envalid';

// Validate and extract environment variables
const env = cleanEnv(process.env, {
  COOKIE_SECRET: str({ default: 'cookie_secret' }),
  JWT_SECRET: str({ default: 'jwt_secret' }),
  PORT: num({ default: 3000 }),
  DB_HOST: str({ default: 'localhost' }),
  DB_PORT: num({ default: 3306 }),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  RATE_LIMIT_MAX: num({ default: 100 }),
  RATE_LIMIT_TIME_WINDOW: str({ default: '1 minute' }),
});

// Export constants
export const constants = {

  //env
  cookieSecret: env.COOKIE_SECRET,
  jwtSecret: env.JWT_SECRET,
  port: env.PORT,
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
  },
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW,
  },

};
