import { and, eq, sql } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";

import { TransactionSelectType, TransactionTable } from "models/Transaction";
import { AccountTable } from "models/Account";
import { db } from "configs/database";
import { UserFromCookie } from "utils/types";
import { handleError, NotFoundError, ValidationError } from "utils/errorHandler";


export async function createTransaction(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	try {
		const user = request.user as UserFromCookie
		const { account_id, amount, description } = request.body as
			Pick<TransactionSelectType, "account_id" | "amount" | "description">


		if (!account_id || !amount)
			throw ValidationError("Missing required fields account id and/or amount")

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

		return reply.status(201).send({ newTransaction, newBalance })

	} catch (error) {
		handleError(error, reply);
	}
}

export async function listTransactions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	try {
		const user = request.user as UserFromCookie
		const { accountId } = request.params as { accountId: string }

		if (!accountId) throw ValidationError("Account Id is required");

		const transactions = await db
			.select()
			.from(TransactionTable)
			.where(
				and(
					eq(TransactionTable.user_id, user.id),
					eq(TransactionTable.account_id, accountId)
				))
			.orderBy(TransactionTable.created_at)

		return reply.send({ transactions })

	} catch (error) {
		handleError(error, reply);
	}
}

export async function updateTransaction(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	try {
		const { id } = request.params as Pick<TransactionSelectType, "id">
		const { amount, description } = request.body as Partial<Pick<TransactionSelectType, "amount" | "description">> || {};

		if (amount === undefined && description === undefined) {
			throw ValidationError("At least one field (amount or description) must be provided");
		}

		const [existingTransaction] = await db
			.select()
			.from(TransactionTable)
			.where(eq(TransactionTable.id, id));

		if (!existingTransaction) throw NotFoundError("Transaction not found");

		const updateData: Partial<TransactionSelectType> = {};
		if (amount !== undefined) updateData.amount = amount;
		if (description !== undefined) updateData.description = description;

		const [updatedTransaction] = await db
			.update(TransactionTable)
			.set(updateData)
			.where(eq(TransactionTable.id, id))
			.returning();

		if (amount !== undefined) {
			const amountDifference = amount - existingTransaction.amount;

			await db
				.update(AccountTable)
				.set({ balance: sql`${AccountTable.balance} + ${amountDifference}` })
				.where(eq(AccountTable.id, existingTransaction.account_id));
		}

		return reply.status(200).send({ updatedTransaction });

	} catch (error) {
		handleError(error, reply);
	}
}

export async function deleteTransaction(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	try {
		const { id } = request.params as Pick<TransactionSelectType, "id">;

		const [transaction] = await db
			.select({ amount: TransactionTable.amount, account_id: TransactionTable.account_id })
			.from(TransactionTable)
			.where(eq(TransactionTable.id, id));

		if (!transaction) throw NotFoundError("Transaction not found");

		await db.delete(TransactionTable).where(eq(TransactionTable.id, id));

		await db
			.update(AccountTable)
			.set({ balance: sql`${AccountTable.balance} - ${transaction.amount}` })
			.where(eq(AccountTable.id, transaction.account_id));

		return reply.status(200).send({ message: "Transaction deleted successfully" });

	} catch (error) {
		handleError(error, reply);
	}
}
