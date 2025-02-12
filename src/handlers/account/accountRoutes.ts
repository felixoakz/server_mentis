import { FastifyInstance } from "fastify";
import { authMiddleware } from "middlewares/authMiddleware";
import { createAccount, listAccounts, updateAccount, deleteAccount } from "./accountHandlers";

export default async function accountRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authMiddleware);

  fastify.post("/account-create", createAccount);
  fastify.get("/accounts", listAccounts);
  fastify.put("/accounts/:accountId", updateAccount);
  fastify.delete("/accounts/:accountId", deleteAccount);
}
