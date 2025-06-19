import { build } from './app';
import { config } from './utils/config';
import logger from './utils/logger';

const start = async (): Promise<void> => {
  try {
    const server = await build();

    // Start listening on the configured host and port
    await server.listen({ port: config.port, host: '0.0.0.0' });

    // Log server address on successful startup
    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    logger.info(`Auth service running at http://localhost:${port}`);

    // Graceful shutdown listeners
    const signals = ['SIGINT', 'SIGTERM'];
    for (const signal of signals) {
      process.on(signal, async () => {
        try {
          logger.info(`Received ${signal}, shutting down gracefully...`);
          await server.close();
          logger.info('Server shut down successfully.');
          process.exit(0);
        } catch (err) {
          logger.error('Error during graceful shutdown:', err);
          process.exit(1);
        }
      });
    }
  } catch (err) {
    // Enhanced error logging with detailed information
    logger.error('Error starting server:');

    if (err instanceof Error) {
      logger.error(`Name: ${err.name}`);
      logger.error(`Message: ${err.message}`);
      logger.error(`Stack: ${err.stack}`);

      // Log any additional properties
      const additionalInfo = Object.entries(err)
        .filter(([key]) => !['name', 'message', 'stack'].includes(key))
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');

      if (additionalInfo) {
        logger.error(`Additional error info:\n${additionalInfo}`);
      }
    } else {
      logger.error(`Non-Error object thrown: ${JSON.stringify(err)}`);
    }

    process.exit(1);
  }
};

void start();
