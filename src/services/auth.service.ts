import crypto from 'crypto';
import type { User } from '@prisma/client';
import type { UserRepository } from '../repositories/user.repository';
import type { PasswordResetRepository } from '../repositories/password-reset.repository';
import type { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import type { JwtService } from './jwt.services';
import type { LoginInput, RegisterInput } from '../schema/auth.schema';
import type { AuthResponse } from '../types/auth.types';
import { userRepository } from '../repositories/user.repository';
import { passwordResetRepository } from '../repositories/password-reset.repository';
import { refreshTokenRepository } from '../repositories/refresh-token.repository';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import { jwtService } from './jwt.services';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';
import logger from '../utils/logger';

export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private refreshTokenRepo: RefreshTokenRepository,
    private passwordResetRepo: PasswordResetRepository,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, nickname } = data;

    // Validate nickname and email
    if (await this.userRepo.findByEmail(email)) {
      throw new ConflictError('A user with this email already exists');
    }
    if (nickname && (await this.userRepo.findByNickname(nickname))) {
      throw new ConflictError('This nickname is already taken');
    }

    // Generate hashed password
    const hashedPassword = await hashPassword(data.password);
    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });

    // Generate tokens and format response
    return this.generateAuthResponse(user);
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive || user.deletedAt) {
      throw new UnauthorizedError('This account has been deactivated');
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens and format response
    return this.generateAuthResponse(user);
  }

  // async googleAuth(): Promise<AuthResponse> {
  //   // Verify Google token
  //   const googleUser = await this.googleService.verifyToken(data.googleToken);
  //   if (!googleUser.email || !googleUser.name || !googleUser.sub) {
  //     throw new UnauthorizedError('Invalid Google token payload');
  //   }

  //   // Find or create user
  //   let user = await this.userRepo.findByGoogleId(googleUser.sub);
  //   if (!user) {
  //     // NOTE: If no user with this googleId, check if an account with this email exists
  //     const existingUser = await this.userRepo.findByEmail(googleUser.email);
  //     if (existingUser) {
  //       // NOTE: Link Google account to existing user
  //       user = await this.userRepo.update(existingUser.id, {
  //         googleId: googleUser.sub,
  //         avatar: googleUser.picture,
  //         isVerified: true,
  //       });
  //     } else {
  //       // NOTE: Create a new user
  //       user = await this.userRepo.create({
  //         email: googleUser.email,
  //         name: googleUser.name,
  //         googleId: googleUser.sub,
  //         avatar: googleUser.picture,
  //         isVerified: true,
  //       });
  //     }
  //   }

  //   // Generate tokens and format response
  //   return this.generateAuthResponse(user);
  // }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    // Verify refresh token from DB
    const storedToken = await this.refreshTokenRepo.findByToken(token);
    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Verify token signature
    const payload = this.jwtService.verifyRefreshToken(token);

    // Generate a new access token
    const accessToken = this.jwtService.generateTokenPair(
      payload.userId,
      payload.email
    ).accessToken;
    return { accessToken };
  }

  async logout(token: string): Promise<void> {
    await this.refreshTokenRepo.revokeToken(token);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepo.revokeAllUserTokens(userId);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      logger.warn(`Password reset requested user: ${email}`);
      return;
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.passwordResetRepo.create({ email, token, expiresAt });

    // TODO: send an email here with the reset link/token.
    // implement email service to send the reset link
    // can use mailhog, nodemailer, or any other email service
    logger.info(`Password reset token for ${email}: ${token}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetRequest = await this.passwordResetRepo.findByToken(token);
    if (!resetRequest || resetRequest.isUsed || resetRequest.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired password reset token');
    }

    const user = await this.userRepo.findByEmail(resetRequest.email);
    if (!user) {
      throw new NotFoundError('User associated with this token not found');
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.userRepo.update(user.id, { password: hashedPassword });
    await this.passwordResetRepo.markAsUsed(token);
  }

  private async generateAuthResponse(user: User): Promise<AuthResponse> {
    const tokens = this.jwtService.generateTokenPair(user.id, user.email);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // ~7 days

    await this.refreshTokenRepo.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname || undefined,
        avatar: user.avatar || undefined,
        isVerified: user.isVerified,
      },
      tokens,
    };
  }
}

export const authService = new AuthService(
  userRepository,
  refreshTokenRepository,
  passwordResetRepository,
  jwtService
  // googleService
);
