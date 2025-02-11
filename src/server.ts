import Fastify, { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import chalk from "chalk";

import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import { constants } from "configs/constants";
import accountRoute from "handlers/account/accountRoutes";
import authRoute from "./handlers/auth/authRoutes";


const fastify: FastifyInstance = Fastify();

// Register plugins
fastify.register(fastifyCookie, { secret: constants.cookieSecret });

fastify.register(fastifyJwt, {
  secret: constants.jwtSecret,
  cookie: { cookieName: "token", signed: true, },
});

fastify.register(rateLimit, {
  max: constants.rateLimit.max,
  timeWindow: constants.rateLimit.timeWindow,
});

// Middleware
fastify.addHook("onRequest", loggingMiddleware);

// Routes
fastify.register(authRoute, { prefix: "/auth" });
fastify.register(accountRoute, { prefix: "/api" });

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: constants.port });
    console.log(chalk.bgGray(`\n===> Server is running on http://localhost:${constants.port}`));

  } catch (err) {
    console.log(chalk.bgRed(err))
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
