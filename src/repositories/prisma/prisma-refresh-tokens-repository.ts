import { Prisma } from "@prisma/client";
import { RefreshTokensRepository } from "../refresh-tokens-repository";
import { prisma } from "../../lib/prisma";

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  async create(data: Prisma.RefreshTokenUncheckedCreateInput) {
    const refreshToken = await prisma.refreshToken.create({
      data,
    });

    return refreshToken;
  }
}
