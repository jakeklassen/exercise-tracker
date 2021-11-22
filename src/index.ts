import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';

const { app, container } = build({
  container: await initializeContainer(),
  fastifyServerOptions: {
    logger: {
      prettyPrint: true,
    },
  },
});

const port = container.cradle.config.get('port');

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port} 🚀`);
});

const cleanup = async () => {
  await app.close();

  // await container.cradle.database.then((db) => db.close());
  await container.dispose();

  process.exit(0);
};

// https://www.baeldung.com/linux/sigint-and-other-termination-signals#how-sigint-relates-to-sigterm-sigquit-and-sigkill
process.on('SIGINT', async () => {
  await cleanup();
});

process.on('SIGTERM', async () => {
  await cleanup();
});

process.on('SIGUSR2', async () => {
  await cleanup();
});
