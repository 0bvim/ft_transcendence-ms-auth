// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FastifyReply, FastifyRequest } from 'fastify';

// Type augmentation for Fastify to support cookie methods
declare module 'fastify' {
  interface FastifyRequest {
    cookies: {
      [key: string]: string;
    };
  }

  interface FastifyReply {
    setCookie(
      name: string,
      value: string,
      options?: {
        domain?: string;
        path?: string;
        maxAge?: number;
        expires?: Date;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
      }
    ): FastifyReply;

    clearCookie(
      name: string,
      options?: {
        domain?: string;
        path?: string;
      }
    ): FastifyReply;
  }
}
