import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import { config } from '../utils/config';

const rateLimitPlugin: FastifyPluginAsync = async fastify => {
  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.windowMs,
  });
};

export default fp(rateLimitPlugin);
