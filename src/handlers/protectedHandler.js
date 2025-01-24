export async function protectedHandler(request, reply) {
  reply.send({ message: "This is a protected route", user: request.user });
}
