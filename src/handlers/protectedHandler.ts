import { FastifyReply, FastifyRequest } from "fastify";

export async function protectedHandler(request: FastifyRequest, reply: FastifyReply) {
  reply.send({ message: "This is a protected route", user: request.user });
}
