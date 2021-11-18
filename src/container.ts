import awilix, { Lifetime, ModuleDescriptor } from 'awilix';
import { camelCase, pascalCase } from 'change-case';

/**
 * App service container interface. When adding types, extend the interface.
 * @example
 * ```
 * declare module '#app/container.js' {
 *   interface AppCradle {
 *     prop: type;
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppCradle {}

const container = awilix.createContainer<AppCradle>();

export type AppContainer = awilix.AwilixContainer<AppCradle>;

export const initializeContainer = async () => {
  await container.loadModules(
    [
      ['**/providers/*.js', { lifetime: Lifetime.SINGLETON }],
      [
        '**/providers/mongoose.js',
        {
          lifetime: Lifetime.SINGLETON,
          async dispose(mongoose: AppCradle['mongoose']) {
            await mongoose.then((client) => client.disconnect());
          },
        },
      ],
      // TODO Check what the default `Lifetime` is
      '**/*.model.js',
      '**/*.router.js',
    ],
    {
      esModules: true,
      /**
       * This method will determine the name in the container.
       * We'll favour pascal case for things like models.
       * The rest will be camel case.
       * @param name
       * @param descriptor
       * @returns
       */
      formatName(name: string, descriptor: ModuleDescriptor): string {
        // console.log(name, descriptor);

        if (name.endsWith('.model')) {
          return pascalCase(name);
        }

        return camelCase(name);
      },
    },
  );

  return container;
};
