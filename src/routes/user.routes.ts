import type { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

// eslint-disable-next-line require-await, @typescript-eslint/explicit-function-return-type
export async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/me', userController.getMe);

  // TODO: add more user-related routes as needed
}
