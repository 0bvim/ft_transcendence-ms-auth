/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable require-await */
import type { PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { token: string; userId: string; expiresAt: Date }) {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findByToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async revokeToken(token: string) {
    return this.prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: { isRevoked: true },
    });
  }
}

// Export a singleton instance
export const refreshTokenRepository = new RefreshTokenRepository(prisma);
