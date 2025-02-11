import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../configs/database";
import { and, eq } from "drizzle-orm";
import { AccountTable } from "../../models/Account";

interface UserFromCookie {
  id: string,
  iat: number,
}

export async function createAccount(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { accountName } = request.body as { accountName?: string }
    const user = request.user as UserFromCookie

    if (!accountName || accountName.trim() === '')
      throw new Error("Account name is required")

    const existingAccount = await db
      .select()
      .from(AccountTable)
      .where(
        and(
          eq(AccountTable.user_id, user.id),
          eq(AccountTable.name, accountName)
        )
      );

    if (existingAccount.length > 0)
      throw new Error("Account name already exists")

    const [newAccount] = await db
      .insert(AccountTable)
      .values({ user_id: user.id, name: accountName })
      .returning()

    return reply.status(201).send(newAccount);

  } catch (error: any) {
    reply.status(400).send({ error: error.message });
    console.log(error)
  }
}
