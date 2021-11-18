import { AppCradle } from '#app/container.js';
import { MongoDBStorage, RunnableMigration, Umzug } from 'umzug';
import { URL } from 'url';

declare module '#app/container.js' {
  interface AppCradle {
    umzug: Promise<Umzug>;
  }
}

export interface MigrationContext {
  context: AppCradle;
}

export default async function resolveUmzug(cradle: AppCradle): Promise<Umzug> {
  const migrationsPath = new URL('..', import.meta.url).pathname;
  const connection = (await cradle.mongoose).connection;

  const umzug = new Umzug({
    logger: console,
    context: cradle,
    migrations: {
      glob: ['migrations/*.js', { cwd: migrationsPath }],
      resolve(params) {
        const getModule = () => import(params.path!);

        const resolver: RunnableMigration<AppCradle> = {
          name: params.name,
          path: params.path,
          up: async (upParams) => (await getModule()).up(upParams),
          down: async (downParams) => (await getModule()).down(downParams),
        };

        return resolver;
      },
    },
    storage: new MongoDBStorage({
      connection,
    }),
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return umzug;
}
