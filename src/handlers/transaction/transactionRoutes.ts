import { FastifyInstance } from "fastify";

import { authMiddleware } from "middlewares/authMiddleware";
import { createTransaction, listTransactions } from "handlers/transaction/transactionHandlers";


export default async function transactionRoute(fastify: FastifyInstance) {
	fastify.addHook("onRequest", authMiddleware)

	fastify.post("/transactions", createTransaction)
	fastify.get("/transactions", listTransactions)
}
