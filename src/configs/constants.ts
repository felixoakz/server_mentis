import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const requiredEnvVars = [
  'COOKIE_SECRET',
  'JWT_SECRET',
  'DATABASE_URL',
  'RATE_LIMIT_MAX',
  'RATE_LIMIT_TIME_WINDOW',
  'PORT'
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(chalk.bgRed.bold(`# Missing required environment variable: ${varName}`));
  }
}

export const constants = {
  // env
  cookieSecret: process.env.COOKIE_SECRET,
  jwtSecret: process.env.JWT_SECRET! || 'default_jwt_secret',
  port: Number(process.env.PORT),

  db: {
    databaseUrl: process.env.DATABASE_URL!
  },

  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX),
    timeWindow: process.env.RATE_LIMIT_TIME_WINDOW,
  },


};
