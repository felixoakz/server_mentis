import Fastify, { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import chalk from "chalk";

import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import { constants } from "configs/constants";
import accountRoute from "handlers/account/accountRoutes";
import authRoute from "handlers/auth/authRoutes";
import transactionRoute from "handlers/transaction/transactionRoutes";
import cors from "@fastify/cors";

const { cookieSecret, jwtSecret, rateLimit, port } = constants;

const fastify: FastifyInstance = Fastify();

// Register plugins
fastify.register(fastifyCookie, { secret: cookieSecret });
fastify.register(fastifyJwt, { secret: jwtSecret, cookie: { cookieName: "token", signed: true } });
fastify.register(fastifyRateLimit, { max: rateLimit.max, timeWindow: rateLimit.timeWindow });
await fastify.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
})

// Middleware
fastify.addHook("onRequest", loggingMiddleware);

// Routes
const routes = [
  { route: authRoute, prefix: "/auth" },
  { route: accountRoute, prefix: "/api" },
  { route: transactionRoute, prefix: "/api" },
];

routes.forEach(({ route, prefix }) => fastify.register(route, { prefix }));

// Start server
const start = async (): Promise<void> => {
  try {
    await fastify.listen({ port });
    console.log(chalk.bgGray(`\n===> Server is running on http://localhost:${port}`));
  } catch (err) {
    console.error(chalk.bgRed(err));
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
