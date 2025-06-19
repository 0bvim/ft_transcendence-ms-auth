import type { FastifyReply, FastifyRequest } from 'fastify';
import type { JwtPayload } from '../types/jwt.types';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    // Use the custom decorator for verifying access tokens
    const decoded = (await request.server.verifyAccessToken(request, reply)) as JwtPayload;

    if (!decoded) {
      // If the decorator already sent a response, just return
      return;
    }

    // Attach user information to the request object for later use
    request.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch {
    reply.status(401).send({ message: 'Authentication failed: Invalid token' });
    return;
  }
};
