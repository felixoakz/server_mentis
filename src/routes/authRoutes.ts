import { loginHandler, registerHandler } from "../handlers/authHandler.js";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export default async function authRoute(fastify: FastifyInstance) {

  fastify.post("/register", registerHandler);
  fastify.post("/login", (req: FastifyRequest, reply: FastifyReply) => loginHandler(fastify, req, reply));

}
