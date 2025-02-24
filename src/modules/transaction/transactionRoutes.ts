import { FastifyInstance } from "fastify";

import { authMiddleware } from "middlewares/authMiddleware";
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from "modules/transaction/transactionHandlers";


export default async function transactionRoute(fastify: FastifyInstance) {
	fastify.addHook("onRequest", authMiddleware)

	fastify.post("/transactions", createTransaction)
	fastify.get("/transactions/:accountId", listTransactions)
	fastify.put("/transactions/:id", updateTransaction)
	fastify.delete("/transactions/:id", deleteTransaction)
}
