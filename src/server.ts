import fastify from "fastify";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";
import { env } from "./env";

const app = fastify({ logger: true });

app.register(appRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    // when error come from Zod, it's a validation error
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
  }

  // For other errors, we log them and return a generic error message
  app.log.error(error);

  return reply.status(500).send({ message: "Internal Server error." });
});

const start = async () => {
  try {
    await app.listen({
      port: env.PORT ? Number(process.env.PORT) : 4242,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
