import { authMiddleware } from "../middlewares/authMiddleware.js";
import { protectedHandler } from "../handlers/protectedHandler.js";

export default async function protectedRoute(fastify) {
  fastify.addHook("onRequest", authMiddleware);

  fastify.get("/protected", protectedHandler);
}
