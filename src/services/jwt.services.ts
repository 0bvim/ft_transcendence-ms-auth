import jwt, { type SignOptions } from 'jsonwebtoken';
import type { JwtPayload, TokenPair } from '../types/jwt.types';
import { config } from '../utils/config';
import logger from '../utils/logger';
import type { StringValue } from 'ms';

export class JwtService {
  generateTokenPair(userId: string, email: string): TokenPair {
    const accessToken = this.generateAccessToken(userId, email);
    const refreshToken = this.generateRefreshToken(userId, email);
    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email, type: 'access' };
    try {
      const signOptions: SignOptions = {
        expiresIn: config.jwt.accessExpiresIn as StringValue,
        algorithm: 'HS256',
        issuer: config.projectName,
      };
      return jwt.sign(payload, config.jwt.accessSecret, signOptions);
    } catch (error) {
      logger.error({ err: error }, 'Error generating access token');
      throw new Error('Failed to generate access token');
    }
  }

  private generateRefreshToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email, type: 'refresh' };
    try {
      const signOptions: SignOptions = {
        expiresIn: config.jwt.refreshExpiresIn as StringValue,
        algorithm: 'HS256',
        issuer: config.projectName,
      };
      return jwt.sign(payload, config.jwt.refreshSecret, signOptions);
    } catch (error) {
      logger.error({ err: error }, 'Error generating refresh token');
      throw new Error('Failed to generate refresh token');
    }
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwt.accessSecret, {
        algorithms: ['HS256'],
        issuer: config.projectName,
      }) as JwtPayload;
    } catch (error) {
      logger.error({ err: error }, 'Error verifying access token');
      throw error;
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwt.refreshSecret, {
        algorithms: ['HS256'],
        issuer: config.projectName,
      }) as JwtPayload;
    } catch (error) {
      logger.error({ err: error }, 'Error verifying refresh token');
      throw error;
    }
  }
}

export const jwtService = new JwtService();
