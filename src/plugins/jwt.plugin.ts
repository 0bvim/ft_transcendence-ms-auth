import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { config } from '../utils/config';

const jwtPlugin: FastifyPluginAsync = async fastify => {
  await fastify.register(jwt, {
    secret: config.jwt.accessSecret,
  });
};

export default fp(jwtPlugin);
