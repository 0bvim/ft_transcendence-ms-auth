export interface JwtPayload {
  userId: string;
  email: string;
  type: "access" | "refresh";
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  userId: string;
  email: string;
  type: string;
  iat: number; // Issued at
  exp: number; // Expiration time
}

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
    };
  }
}
