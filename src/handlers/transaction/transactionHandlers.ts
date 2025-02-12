import { FastifyReply, FastifyRequest } from "fastify";
import { UserFromCookie } from "types/userTypes";

export async function createTransaction(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.user as UserFromCookie
		console.log('user', user)

	} catch (error: unknown) {
		//if (error.instanceof Error) {
		//	reply.status(400).send({ error: error.message })
		//
		//} else {
		//	reply.status(500).send({error: "An unexpected error occurred"})
		//}
	}
}
