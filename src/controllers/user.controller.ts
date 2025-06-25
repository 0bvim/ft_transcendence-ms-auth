// src/controllers/user.controller.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { userRepository } from '../repositories/user.repository';
import { createSuccessResponse, HTTP_STATUS } from '../utils/response';
import { NotFoundError } from '../utils/errors';

export const userController = {
  async getMe(request: FastifyRequest, reply: FastifyReply) {
    // request.user is guaranteed to exist by the 'authenticate' middleware
    const userId = request.user?.userId;

    if (!userId) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({ message: 'User not authenticated' });
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password: _password, ...userProfile } = user;
    return reply
      .status(HTTP_STATUS.OK)
      .send(createSuccessResponse('User profile fetched', userProfile));
  },
};
