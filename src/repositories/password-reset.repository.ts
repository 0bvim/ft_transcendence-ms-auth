/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable require-await */
import type { PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class PasswordResetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { email: string; token: string; expiresAt: Date }) {
    return this.prisma.passwordReset.create({
      data,
    });
  }

  async findByToken(token: string) {
    return this.prisma.passwordReset.findUnique({
      where: { token },
    });
  }

  async markAsUsed(token: string) {
    return this.prisma.passwordReset.update({
      where: { token },
      data: { isUsed: true },
    });
  }
}

// Export a singleton instance
export const passwordResetRepository = new PasswordResetRepository(prisma);
