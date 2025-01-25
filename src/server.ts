// app.ts
import Fastify, { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import authRoute from "./routes/authRoutes";
import protectedRoute from "./routes/protectedRoutes";
import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import { constants } from "./configs/constants";

const fastify: FastifyInstance = Fastify();

// Register plugins
fastify.register(fastifyCookie, { secret: constants.cookieSecret });

fastify.register(fastifyJwt, {
  secret: constants.jwtSecret,
  cookie: {
    cookieName: "token",
    signed: true,
  },
});

fastify.register(rateLimit, {
  max: constants.rateLimit.max,
  timeWindow: constants.rateLimit.timeWindow,
});

// Middleware
fastify.addHook("onRequest", loggingMiddleware);

// Routes
fastify.register(authRoute, { prefix: "/auth" });
fastify.register(protectedRoute, { prefix: "/api" });

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: constants.port });
    console.log(`Server is running on http://localhost:${constants.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
