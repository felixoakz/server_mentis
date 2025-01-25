import { FastifyReply, FastifyRequest } from "fastify";

export async function loggingMiddleware(request: FastifyRequest, reply: FastifyReply) {
  console.log(`${request.method} ${request.url}`);
}
