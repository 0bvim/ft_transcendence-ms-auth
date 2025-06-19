import type { FastifyReply, FastifyRequest } from 'fastify';
import type { JwtPayload } from '../types/jwt.types';
import logger from '../utils/logger';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    // Method added by the @fastify/jwt plugin
    const decoded = await request.jwtVerify<JwtPayload>();

    // Attach user information to the request object for later use
    request.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    logger.error('Authentication failed:', error);
    reply.status(401).send({ message: 'Authentication failed: Invalid token' });
    return;
  }
};
