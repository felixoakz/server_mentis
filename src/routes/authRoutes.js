import { loginHandler, registerHandler } from "../handlers/authHandler.js";

export default async function authRoute(fastify) {

  fastify.post("/register", registerHandler);
  fastify.post("/login", (req, reply) => loginHandler(fastify, req, reply));

}
