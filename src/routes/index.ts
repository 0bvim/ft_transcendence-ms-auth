/* eslint-disable require-await */
import type { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';

export async function apiRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(userRoutes, { prefix: '/users' });

  // Health check route
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));
}
