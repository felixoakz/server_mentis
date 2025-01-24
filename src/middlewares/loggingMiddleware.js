export async function loggingMiddleware(request, reply) {
  console.log(`${request.method} ${request.url}`);
}
