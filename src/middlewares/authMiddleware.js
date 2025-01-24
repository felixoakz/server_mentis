export async function authMiddleware(request, reply) {
  try {
    await request.jwtVerify();

  } catch (err) {
    console.log('authMiddleware Error:\n', err)
    reply.status(401).send({ error: "Unauthorized" });
  }
}
