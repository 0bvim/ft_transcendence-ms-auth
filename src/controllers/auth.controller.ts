// import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from '../services/auth.service';
import type {
  GoogleAuthInput,
  LoginInput,
  RegisterInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from '../schema/auth.schema';
import { createSuccessResponse, HTTP_STATUS } from '../utils/response';
import { AppError } from '../utils/errors';

// Set refresh token in a secure, httpOnly cookie
const setRefreshTokenCookie = (reply: FastifyReply, token: string): void => {
  reply.setCookie?.('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only send over https in production
    path: '/',
    sameSite: 'strict',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
};

export const authController = {
  async register(request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) {
    try {
      const authResponse = await authService.register(request.body);
      setRefreshTokenCookie(reply, authResponse.tokens.refreshToken);
      return reply.status(HTTP_STATUS.CREATED).send(
        createSuccessResponse('User registered successfully', {
          user: authResponse.user,
          accessToken: authResponse.tokens.accessToken,
        })
      );
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An unexpected error occurred' });
    }
  },

  async login(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    try {
      const authResponse = await authService.login(request.body);
      setRefreshTokenCookie(reply, authResponse.tokens.refreshToken);
      return reply.status(HTTP_STATUS.OK).send(
        createSuccessResponse('Login successful', {
          user: authResponse.user,
          accessToken: authResponse.tokens.accessToken,
        })
      );
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An unexpected error occurred' });
    }
  },

  async googleAuth(request: FastifyRequest<{ Body: GoogleAuthInput }>, reply: FastifyReply) {
    try {
      const authResponse = await authService.googleAuth(request.body);
      setRefreshTokenCookie(reply, authResponse.tokens.refreshToken);
      return reply.status(HTTP_STATUS.OK).send(
        createSuccessResponse('Google authentication successful', {
          user: authResponse.user,
          accessToken: authResponse.tokens.accessToken,
        })
      );
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An unexpected error occurred' });
    }
  },

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    try {
      const currentRefreshToken = request.cookies.refreshToken;
      if (!currentRefreshToken) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send({ message: 'Refresh token not found' });
      }

      try {
        // Verify the refresh token directly with the standard method
        await request.jwtVerify();
      } catch {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send({ message: 'Invalid refresh token' });
      }

      const { accessToken } = await authService.refreshToken(currentRefreshToken);
      return reply
        .status(HTTP_STATUS.OK)
        .send(createSuccessResponse('Token refreshed successfully', { accessToken }));
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An unexpected error occurred' });
    }
  },

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const currentRefreshToken = request.cookies.refreshToken;
      if (currentRefreshToken) {
        await authService.logout(currentRefreshToken);
      }
      reply.clearCookie('refreshToken');
      return reply.status(HTTP_STATUS.OK).send(createSuccessResponse('Logout successful'));
    } catch {
      reply.clearCookie('refreshToken');
      return reply.status(HTTP_STATUS.OK).send(createSuccessResponse('Logout successful'));
    }
  },

  async logoutAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (request.user) {
        // request.user is set by the authenticate middleware
        await authService.logoutAll(request.user.userId);
      }
      reply.clearCookie('refreshToken');
      return reply
        .status(HTTP_STATUS.OK)
        .send(createSuccessResponse('Logged out from all devices'));
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An unexpected error occurred' });
    }
  },

  async requestPasswordReset(
    request: FastifyRequest<{ Body: RequestPasswordResetInput }>,
    reply: FastifyReply
  ) {
    await authService.requestPasswordReset(request.body.email);
    // Always return a success message to prevent user enumeration
    return reply
      .status(HTTP_STATUS.OK)
      .send(
        createSuccessResponse(
          'If an account with this email exists, a password reset link has been sent.'
        )
      );
  },

  async resetPassword(request: FastifyRequest<{ Body: ResetPasswordInput }>, reply: FastifyReply) {
    try {
      await authService.resetPassword(request.body.token, request.body.newPassword);
      return reply
        .status(HTTP_STATUS.OK)
        .send(createSuccessResponse('Password has been reset successfully.'));
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An unexpected error occurred' });
    }
  },
};
