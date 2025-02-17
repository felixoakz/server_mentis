import { desc, eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";

import { TransactionTable } from "models/Transaction";
import { TransactionCreationObject, TransactionUpdateObject } from "types/transactionTypes";
import { db } from "configs/database";
import { UserFromCookie } from "types/userTypes";


export async function createTransaction(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	try {
		const user = request.user as UserFromCookie
		const { accountId, amount, description } = request.body as TransactionCreationObject;

		if (!accountId || !amount)
			throw new Error("Missing required fields account id and ammount")

		const [lastTransaction] = await db
			.select({ balanceAfter: TransactionTable.balance_after })
			.from(TransactionTable)
			.where(eq(TransactionTable.account_id, accountId))
			.orderBy(desc(TransactionTable.created_at))
			.limit(1)
			.execute();

		const lastBalance = lastTransaction?.balanceAfter ?? 0
		const balanceAfter = lastBalance + (amount)

		const [newTransaction] = await db
			.insert(TransactionTable)
			.values({
				account_id: accountId,
				user_id: user.id,
				amount: amount,
				balance_after: balanceAfter,
				description: description
			})
			.returning()

		return reply.status(201).send(newTransaction)

	} catch (error: unknown) {
		if (error instanceof Error) {
			reply.status(400).send({ error: error.message })
		} else {
			reply.status(500).send({ error: "An unexpected error occurred" })
		}
	}
}

export async function listTransactions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	try {
		const user = request.user as UserFromCookie

		const transactions = await db
			.select()
			.from(TransactionTable)
			.where(eq(TransactionTable.user_id, user.id))

		return reply.send(transactions)

	} catch (error) {
		if (error instanceof Error) {
			reply.status(400).send({ error: error.message })
		} else {
			reply.status(500).send({ error: "An unexpected error occurred" })
		}
	}
}

export async function updateTransaction(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	try {
		const { transactionId } = request.params as { transactionId: string }
		const { amount, description } = request.body as TransactionUpdateObject

		if (!amount) throw new Error("Transaction name is required")

		const [existingTransaction] = await db
			.select()
			.from(TransactionTable)
			.where(eq(TransactionTable.id, transactionId))

		if (!existingTransaction) throw new Error("Transaction not Found")

		const [updatedTransaction] = await db
			.update(TransactionTable)
			.set({ amount: amount, description: description })
			.where(eq(TransactionTable.id, transactionId))
			.returning()

		return reply.status(200).send({ updatedTransaction })

	} catch (error) {
		if (error instanceof Error) {
			reply.status(400).send({ error: error.message })
		} else {
			reply.status(500).send({ error: "An unexpected error occurred" })
		}
	}
}
