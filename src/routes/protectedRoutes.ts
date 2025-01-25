import { authMiddleware } from "../middlewares/authMiddleware.js";
import { protectedHandler } from "../handlers/protectedHandler.js";
import { FastifyInstance } from "fastify";

export default async function protectedRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authMiddleware);

  fastify.get("/protected", protectedHandler);
}
