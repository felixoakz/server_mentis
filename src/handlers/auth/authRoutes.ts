import { authLogin, authRegister } from "./authController";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export default async function authRoute(fastify: FastifyInstance) {

  fastify.post("/register", authRegister);
  fastify.post("/login", (req: FastifyRequest, reply: FastifyReply) => authLogin(fastify, req, reply));

}
