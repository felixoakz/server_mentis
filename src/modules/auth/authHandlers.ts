import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserSelectType, UserTable } from "models/User";
import { db } from "configs/database";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';
import { handleError, NotFoundError, ValidationError } from "utils/errorHandler";


export async function authRegister(request: FastifyRequest, reply: FastifyReply): Promise<void> {

  try {
    const { username, email, password } = request.body as Pick<UserSelectType, "username" | "email" | "password">

    if (!username || !email || !password)
      throw ValidationError('Username, email, and password are required');

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(UserTable)
      .values({ username, email, password: hashedPassword })
      .returning();

    reply.send({
      message: "User registered",
      user
    });

  } catch (error) {
    handleError(error, reply);
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
      throw NotFoundError("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      throw ValidationError("Invalid password");

    const token = fastify.jwt.sign({ id: user.id });

    reply.setCookie("token", token, { httpOnly: true, signed: true, path: "/" });
    reply.send({ message: "Logged in" });

  } catch (error) {
    handleError(error, reply);
  }
}
