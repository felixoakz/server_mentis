import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const requiredEnvVars = [
  'COOKIE_SECRET',
  'JWT_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'RATE_LIMIT_MAX',
  'RATE_LIMIT_TIME_WINDOW',
  'PORT'
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(chalk.red.bold(`# Missing required environment variable: ${varName}`));
  }
}

export const constants = {

  //env
  cookieSecret: process.env.COOKIE_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  port: Number(process.env.PORT),

  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX),
    timeWindow: process.env.RATE_LIMIT_TIME_WINDOW,
  },
};
