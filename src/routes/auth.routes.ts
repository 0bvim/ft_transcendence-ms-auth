// src/routes/auth.routes.ts
import type { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';
import * as schemas from '../schema/auth.schema';
import { authenticate } from '../middleware/auth.middleware';

// eslint-disable-next-line require-await
export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { schema: schemas.registerSchema }, authController.register);
  fastify.post('/login', { schema: schemas.loginSchema }, authController.login);
  fastify.post('/google', { schema: schemas.googleAuthSchema }, authController.googleAuth);

  fastify.post('/refresh', authController.refreshToken);
  fastify.post('/logout', authController.logout);

  fastify.post(
    '/request-password-reset',
    { schema: schemas.requestPasswordResetSchema },
    authController.requestPasswordReset
  );
  fastify.post(
    '/reset-password',
    { schema: schemas.resetPasswordSchema },
    authController.resetPassword
  );

  // Protected route
  fastify.post('/logout-all', { preHandler: [authenticate] }, authController.logoutAll);
}
