import { FastifyInstance } from "fastify";

import { authMiddleware } from "middlewares/authMiddleware";
import { createTransaction, listTransactions, updateTransaction } from "handlers/transaction/transactionHandlers";


export default async function transactionRoute(fastify: FastifyInstance) {
	fastify.addHook("onRequest", authMiddleware)

	fastify.post("/transactions", createTransaction)
	fastify.get("/transactions", listTransactions)
	fastify.put("/transactions/:id", updateTransaction)
}
