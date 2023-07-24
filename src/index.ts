import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { addCleanupListener, exitAfterCleanup } from 'async-cleanup';
import fastify from 'fastify';
import { Logger } from 'tslog';

const logger = new Logger();

const { app, container } = build({
  container: await initializeContainer(),
  fastifyInstance: fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    },
  }),
});

const port = container.cradle.config.get('port');

app.listen({ port }, () => {
  console.log(`Server listening on http://localhost:${port} 🚀`);
});

const cleanup = async () => {
  logger.debug(`Exit hook cleanup`);

  await app.close();
  await container.dispose();

  await exitAfterCleanup(process.exitCode);
};

addCleanupListener(cleanup);
