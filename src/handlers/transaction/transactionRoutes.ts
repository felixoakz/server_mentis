import { FastifyInstance } from "fastify";

import { authMiddleware } from "middlewares/authMiddleware";
import { createTransaction } from "handlers/transaction/transactionHandlers";


export default async function transactionRoute(fastify: FastifyInstance) {
	fastify.addHook("onRequest", authMiddleware)

	fastify.post("/transactions", createTransaction)
}
