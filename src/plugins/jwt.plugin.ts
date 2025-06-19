import type { FastifyPluginAsync } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { config } from '../utils/config';

const jwtPlugin: FastifyPluginAsync = async fastify => {
  await fastify.register(jwt, {
    secret: config.jwt.accessSecret,
    sign: {
      expiresIn: config.jwt.accessExpiresIn,
    },
    decode: { complete: true },
  });

  // Add custom decorators for token verification
  fastify.decorate(
    'verifyAccessToken',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        return await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({ message: 'Invalid access token' });
        return null;
      }
    }
  );
};

export default fp(jwtPlugin);
