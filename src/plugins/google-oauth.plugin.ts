import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import oauthPlugin from '@fastify/oauth2';
import { config } from '../utils/config';

const googleOAuthPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: config.google.clientId,
        secret: config.google.clientSecret,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: config.google.startUrl,
    callbackUri: config.google.callbackUrl,
  });
};

export default fastifyPlugin(googleOAuthPlugin);
