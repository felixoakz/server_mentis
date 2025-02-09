import { db } from "../configs/database";
import { eq } from "drizzle-orm";
import { FastifyInstance, FastifyRequest } from "fastify";
import { AccountTable } from "../models/Account";


type Account = typeof AccountTable.$inferSelect;

export async function createAccount(requestBody: FastifyRequest): Promise<Account> {
  const {name} = requestBody.body as {name?: string}
  const userId = requestBody.user.id

  if (!name || name.trim() === '')
    throw new Error("Account name is required")

  const existingAccount = await db
    .select()
    .from(AccountTable)
    .where(eq(AccountTable.user_id, userId))
    .where(eq(AccountTable.name, name));

  if (existingAccount.length > 0)
    throw new Error("Account name already exists")

  const [newAccount] = await db
    .insert(AccountTable)
    .values({user_id: userId, name})
    .returning()

  return newAccount
}


