import { FastifyReply, FastifyRequest } from "fastify";


export async function createAccount(request: FastifyRequest, reply: FastifyReply) {
  try {

  } catch (e) {

  }


  reply.send({ message: "This is a protected route", user: request.user });
}
