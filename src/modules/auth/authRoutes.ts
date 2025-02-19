import { authLogin, authRegister } from "./authHandlers";
import { FastifyInstance } from "fastify";

export default async function authRoute(fastify: FastifyInstance) {

  fastify.post("/register", authRegister);
  fastify.post("/login", authLogin);

}
