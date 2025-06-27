import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  // NOTE: Define the expected request body schema using ZOD
  const registerBodySchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
  });

  console.log(registerBodySchema);
  return reply.status(200).send();
}
