import { Prisma, RefreshToken } from "@prisma/client";

export interface RefreshTokensRepository {
  create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken>;

  revoke(id: string): Promise<RefreshToken>;
}
