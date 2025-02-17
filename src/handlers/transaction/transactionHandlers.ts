import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";

import { TransactionSelectType, TransactionTable } from "models/Transaction";
import { AccountTable } from "models/Account";
import { db } from "configs/database";
import { UserFromCookie } from "types/userTypes";


type TransactionUpdateType = Pick<TransactionSelectType, "account_id" | "amount" | "description">

export async function createTransaction(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	try {
		const user = request.user as UserFromCookie
		const { account_id, amount, description } = request.body as TransactionUpdateType

		if (!account_id || !amount)
			throw new Error("Missing required fields account id and/or amount")

		const [currentBalance] = await db
			.select({ balance: AccountTable.balance })
			.from(AccountTable)
			.where(eq(AccountTable.id, account_id))
			.limit(1)

		const balanceAfter = (currentBalance?.balance ?? 0) + amount

		const [newTransaction] = await db
			.insert(TransactionTable)
			.values({
				account_id: account_id,
				user_id: user.id,
				amount: amount,
				description: description
			})
			.returning()

		const [newBalance] = await db
			.update(AccountTable)
			.set({ balance: balanceAfter })
			.where(eq(AccountTable.id, account_id))
			.returning()

		return reply.status(201).send({newTransaction, newBalance})

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
