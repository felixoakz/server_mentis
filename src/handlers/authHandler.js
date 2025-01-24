import { registerUser, loginUser } from "../services/authService.js";

export async function registerHandler(request, reply) {

  try {
    const user = await registerUser(request.body);
    reply.send({ message: "User registered", user });

  } catch (error) {
    reply.status(400).send({ error: error.message });
  }
}

export async function loginHandler(fastify, request, reply) {

  const { email, password } = request.body;

  try {
    const token = await loginUser(fastify, email, password);

    reply.setCookie("token", token, { httpOnly: true, signed: true, path: "/" });

    reply.send({ message: "Logged in" });

  } catch (error) {
    reply.status(401).send({ error: error.message });

  }
}
