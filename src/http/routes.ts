import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { login } from "./controllers/login";

export async function appRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
}
