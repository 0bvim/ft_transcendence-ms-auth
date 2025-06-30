import { Prisma, RefreshToken } from "@prisma/client";
import { RefreshTokensRepository } from "../refresh-tokens-repository";
import { randomUUID } from "node:crypto";

export class InMemoryRefreshTokensRepository
  implements RefreshTokensRepository
{
  public items: RefreshToken[] = [];

  async create(data: Prisma.RefreshTokenUncheckedCreateInput) {
    const refreshToken = {
      id: randomUUID(),
      hashedToken: data.hashedToken,
      userId: data.userId,
      expiresAt: data.expiresAt as Date,
      revoked: false,
      createdAt: new Date(),
    };

    this.items.push(refreshToken);

    return refreshToken;
  }

  async findByToken(hashedToken: string) {
    const refreshToken = this.items.find(
      (item) => item.hashedToken === hashedToken && !item.revoked,
    );
    return refreshToken || null;
  }

  async revoke(id: string) {
    const tokenIndex = this.items.findIndex((item) => item.id === id);
    this.items[tokenIndex].revoked = true;
    return this.items[tokenIndex];
  }
}
