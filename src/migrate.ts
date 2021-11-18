import { initializeContainer } from '#app/container.js';

const container = await initializeContainer();

const umzug = await container.cradle.umzug;

await umzug.runAsCLI();

await container.dispose();
