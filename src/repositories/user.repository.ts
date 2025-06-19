/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable require-await */
import type { PrismaClient } from '@prisma/client';
import type { CreateUserData, UpdateUserData } from '../types/user.types';
import { prisma } from '../utils/prisma';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUserData) {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByNickname(nickname: string) {
    return this.prisma.user.findUnique({ where: { nickname } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async update(id: string, data: UpdateUserData) {
    return this.prisma.user.update({ where: { id }, data });
  }

  // NOTE: Soft delete implementation
  async delete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const userRepository = new UserRepository(prisma);
