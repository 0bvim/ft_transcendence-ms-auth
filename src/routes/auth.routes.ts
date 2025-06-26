import type { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

// eslint-disable-next-line require-await, @typescript-eslint/explicit-function-return-type
export async function authRoutes(fastify: FastifyInstance) {
  // Convert Zod schemas to JSON Schema
  const registerJsonSchema = {
    body: {
      type: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        name: { type: 'string', minLength: 2 },
        nickname: { type: 'string', minLength: 3 },
      },
    },
  };

  const loginJsonSchema = {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 1 },
      },
    },
  };

  const googleAuthJsonSchema = {
    body: {
      type: 'object',
      required: ['googleToken'],
      properties: {
        googleToken: { type: 'string', minLength: 1 },
      },
    },
  };

  const refreshTokenJsonSchema = {
    body: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', minLength: 1 },
      },
    },
  };

  const requestPasswordResetJsonSchema = {
    body: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email' },
      },
    },
  };

  const resetPasswordJsonSchema = {
    body: {
      type: 'object',
      required: ['token', 'newPassword'],
      properties: {
        token: { type: 'string', minLength: 1 },
        newPassword: { type: 'string', minLength: 8 },
      },
    },
  };

  fastify.get('/google/callback', authController.googleAuth);

  fastify.post('/register', { schema: registerJsonSchema }, authController.register);

  fastify.post('/login', { schema: loginJsonSchema }, authController.login);

  fastify.post('/refresh', { schema: refreshTokenJsonSchema }, authController.refreshToken);

  fastify.post('/logout', authController.logout);

  fastify.post(
    '/request-password-reset',
    { schema: requestPasswordResetJsonSchema },
    authController.requestPasswordReset
  );

  fastify.post(
    '/reset-password',
    { schema: resetPasswordJsonSchema },
    authController.resetPassword
  );

  // Protected route
  fastify.post('/logout-all', { preHandler: [authenticate] }, authController.logoutAll);
}
