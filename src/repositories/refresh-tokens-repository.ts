import { Prisma, RefreshToken } from "@prisma/client";

export interface RefreshTokensRepository {
  create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken>;
  findByToken(hashedToken: string): Promise<RefreshToken | null>;
  revoke(id: string): Promise<RefreshToken>;
}
