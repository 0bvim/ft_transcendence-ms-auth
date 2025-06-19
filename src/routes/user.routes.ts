import type { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

export async function userRoutes(fastify: FastifyInstance) {
  // All routes in this file require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.get('/me', userController.getMe);
  // Add other user routes here, e.g., for updating profile
}
