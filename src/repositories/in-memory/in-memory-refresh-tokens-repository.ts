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
      revoked: false,
      createdAt: new Date(),
    };

    this.items.push(refreshToken);

    return refreshToken;
  }
}
