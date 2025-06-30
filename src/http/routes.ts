import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { login } from "./controllers/login";
import { refreshToken } from "./controllers/refresh-token";

export async function appRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
  app.post("/refresh", refreshToken);
}
