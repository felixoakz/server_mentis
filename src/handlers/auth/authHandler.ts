import { FastifyRequest, FastifyReply } from "fastify";
import { registerUser, loginUser } from "./authService";


export async function authRegister(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await registerUser(request.body as { username: string; email: string; password: string });

    reply.send({ message: "User registered", user });

  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
}

export async function authLogin(fastify: any, request: FastifyRequest, reply: FastifyReply) {

  const { email, password } = request.body as { email: string; password: string };

  try {
    const token = await loginUser(fastify, email, password);

    reply.setCookie("token", token, { httpOnly: true, signed: true, path: "/" });
    reply.send({ message: "Logged in" });

  } catch (error: any) {
    reply.status(401).send({ error: error.message });
  }
}
