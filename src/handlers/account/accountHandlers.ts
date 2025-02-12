import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "configs/database";
import { and, eq } from "drizzle-orm";

import { AccountTable } from "models/Account";
import { UserFromCookie } from "types/userTypes";


export async function createAccount(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { accountName } = request.body as { accountName: string }
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

  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "An unexpected error occurred" });
    }
  }
}

export async function listAccounts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = request.user as UserFromCookie;

    const accounts = await db
      .select()
      .from(AccountTable)
      .where(eq(AccountTable.user_id, user.id));

    return reply.status(200).send(accounts);

  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "An unexpected error occurred" });
    }
  }
}

export async function updateAccount(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { accountName } = request.body as { accountName: string }
    const { accountId } = request.params as { accountId: string };
    const user = request.user as UserFromCookie;

    if (!accountName || accountName.trim() === "")
      throw new Error("Account name is required");

    const [existingAccount] = await db
      .select()
      .from(AccountTable)
      .where(
        and(
          eq(AccountTable.id, accountId),
          eq(AccountTable.user_id, user.id)
        )
      );

    if (!existingAccount) throw new Error("Account not found");

    const [updatedAccount] = await db
      .update(AccountTable)
      .set({ name: accountName })
      .where(
        and(
          eq(AccountTable.id, accountId),
          eq(AccountTable.user_id, user.id)
        )
      )
      .returning();

    return reply.status(200).send(updatedAccount);

  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "An unexpected error occurred" });
    }
  }
}

export async function deleteAccount(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { accountId } = request.params as { accountId: string };
    const user = request.user as UserFromCookie;

    const [existingAccount] = await db
      .select()
      .from(AccountTable)
      .where(
        and(
          eq(AccountTable.id, accountId),
          eq(AccountTable.user_id, user.id)
        )
      );

    if (!existingAccount) throw new Error("Account not found");

    await db.delete(AccountTable).where(
      and(
        eq(AccountTable.id, accountId),
        eq(AccountTable.user_id, user.id)
      )
    );

    return reply.status(204).send();

  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "An unexpected error occurred" });
    }
  }
}
