import { db } from "../services/dbService.js";
import { eq } from "drizzle-orm";
import { users } from "../models/User.js";
import bcrypt from "bcrypt";

export async function registerUser(requestBody) {

  const { username, email, password } = requestBody;

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db.insert(users).values({ email, username, password: hashedPassword });

  return user;

}

export async function loginUser(fastify, email, password) {

  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) throw new Error("User not found");

  const isValid = bcrypt.compare(password, user.password);

  if (!isValid) throw new Error("Invalid password");

  return fastify.jwt.sign({ id: user.id }, process.env.JWT_SECRET);

}
