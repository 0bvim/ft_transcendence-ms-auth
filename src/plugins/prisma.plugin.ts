import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { prisma } from '../utils/prisma';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

const prismaPlugin: FastifyPluginAsync = async fastify => {
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async server => {
    await server.prisma.$disconnect();
  });
};

export default fp(prismaPlugin);
