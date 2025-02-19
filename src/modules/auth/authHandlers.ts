import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserSelectType, UserTable } from "models/User";
import { db } from "configs/database";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';


export async function authRegister(request: FastifyRequest, reply: FastifyReply): Promise<void> {

  try {
    const { username, email, password } = request.body as Pick<UserSelectType, "username" | "email" | "password">

    if (!username || !email || !password)
      throw new Error('Username, email, and password are required');

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(UserTable)
      .values({ username, email, password: hashedPassword })
      .returning();

    reply.send({
      message: "User registered",
      user
    });

  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
}


export async function authLogin(request: FastifyRequest, reply: FastifyReply) {

  const fastify = request.server as FastifyInstance;
  const { email, password } = request.body as Pick<UserSelectType, "email" | "password">

  try {
    const [user] = await db.select()
      .from(UserTable)
      .where(eq(UserTable.email, email));

    if (!user)
      throw new Error("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      throw new Error("Invalid password");

    const token = fastify.jwt.sign({ id: user.id });

    reply.setCookie("token", token, { httpOnly: true, signed: true, path: "/" });
    reply.send({ message: "Logged in" });

  } catch (error: any) {
    reply.status(401).send({ error: error.message });
  }
}
