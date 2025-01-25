import { FastifyRequest, FastifyReply } from "fastify";
import chalk from "chalk";

export async function loggingMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const method = request.method;
  const url = request.url;
  const timestamp = new Date().toISOString();

  let methodColor;

  switch (method) {
    case "GET":
      methodColor = chalk.greenBright;
      break;
    case "POST":
      methodColor = chalk.blueBright;
      break;
    case "PUT":
    case "PATCH":
      methodColor = chalk.yellowBright;
      break;
    case "DELETE":
      methodColor = chalk.redBright;
      break;
    default:
      methodColor = chalk.white;
  }
  console.log(
    `=> ${chalk.cyanBright('REQUEST')} > ${methodColor(method)} > ${chalk.cyan(url)} | ${chalk.gray(timestamp)} |`
  );
}
