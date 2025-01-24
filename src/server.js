import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import authRoute from "./routes/authRoutes.js";
import protectedRoute from "./routes/protectedRoutes.js";
import { loggingMiddleware } from "./middlewares/loggingMiddleware.js";
import dotenv from 'dotenv';

const fastify = Fastify();

dotenv.config();

// Register plugins
fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET });

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "token",
    signed: true,
  },
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute"
});

// Middleware
fastify.addHook("onRequest", loggingMiddleware);

// Routes
fastify.register(authRoute, { prefix: "/auth" });
fastify.register(protectedRoute, { prefix: "/api" });

// Start server
const start = async () => {
  try {
    const port = process.env.PORT ?? 3000;
    fastify.listen({ port: port });
    console.log(`Server is running on http://localhost:${port}`);

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);

  }
};

start();
