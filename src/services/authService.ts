import { db } from "../configs/database";
import { eq } from "drizzle-orm";
import { users } from "../models/User";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";


interface RegisterUserObject {
  username: string;
  email: string;
  password: string;
}

type User = typeof users.$inferSelect;


export async function registerUser(requestBody: RegisterUserObject): Promise<User> {

  const { username, email, password } = requestBody;

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db.insert(users)
    .values({ email, username, password: hashedPassword })
    .returning();

  return user;
}

export async function loginUser(fastify: FastifyInstance, email: string, password: string) {

  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  return fastify.jwt.sign({ id: user.id });
}
