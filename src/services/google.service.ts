import type { TokenPayload } from 'google-auth-library';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../utils/config';
import { UnauthorizedError } from '../utils/errors';

export class GoogleService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(config.google.clientId);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: config.google.clientId,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error(); // Triggers the catch block
      }
      return payload;
    } catch {
      throw new UnauthorizedError('Invalid Google token');
    }
  }
}

export const googleService = new GoogleService();
