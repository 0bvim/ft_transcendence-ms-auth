import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import { config } from './utils/config';

// Import Plugins
import prismaPlugin from './plugins/prisma.plugin';
import jwtPlugin from './plugins/jwt.plugin';
import rateLimitPlugin from './plugins/rate-limit.plugin';

// Import Routes
import { apiRoutes } from './routes';

// A factory function to build the app
export const build = async (): Promise<ReturnType<typeof Fastify>> => {
  // Initialize Fastify with logger options
  const fastify = Fastify({
    logger: true,
  });
  fastify.log.info('Starting Auth Service...');

  // Register essential security and utility plugins
  await fastify.register(helmet);
  await fastify.register(cors, {
    origin: config.cors.origin,
    credentials: true, // Important for cookies
  });
  await fastify.register(cookie);

  // Register our custom plugins
  await fastify.register(prismaPlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(rateLimitPlugin);

  // Register our API routes
  await fastify.register(apiRoutes, { prefix: config.apiPrefix });

  // Set a default error handler
  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error);
    // You can add more sophisticated error handling here
    reply.status(error.statusCode || 500).send({
      success: false,
      message: error.message || 'An internal server error occurred',
    });
  });

  return fastify;
};
