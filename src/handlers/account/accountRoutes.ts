import { createAccount } from "./accountHandler";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { FastifyInstance } from "fastify";

export default async function accountRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authMiddleware);

  fastify.post("/accounts", createAccount);
}
