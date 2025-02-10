import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../configs/database";
import { eq } from "drizzle-orm";
import { AccountTable } from "../../models/Account";

export async function createAccount(request: FastifyRequest, reply: FastifyReply) {

  try {
    const { name } = request.body as { name?: string };
    const userId = request.user.id

    console.log(userId)

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
      .values({ user_id: userId, name })
      .returning()

    return reply.status(201).send(newAccount);

  } catch (e) {
    console.log(e)

  }


  reply.send({ message: "This is a protected route", user: request.user });
}
