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

  await Promise.resolve(); // Add await expression to satisfy async function requirement
};

export default fp(prismaPlugin);
