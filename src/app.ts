import { AppCradle } from '#app/container.js';
import { AwilixContainer } from 'awilix';
import fastify from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb';

interface BuildOptions {
  container: AwilixContainer<AppCradle>;
  fastifyServerOptions: Parameters<typeof fastify>[0];
}

/**
 * App factory
 */
export const build = (opts: BuildOptions) => {
  const { fastifyServerOptions, container } = opts;

  const app = fastify(fastifyServerOptions);

  // TODO abstract to error handler
  app.addHook('onError', (request, reply, error, done) => {
    // This is the duplicate key error
    if (error.name === MongoServerError.name && +error.code === 11000) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        statusCode: StatusCodes.BAD_REQUEST,
        error: 'Bad Request',
        message: error.message,
      });
    }

    done();
  });

  app.route(container.cradle.userListRoute);
  app.route(container.cradle.userCreateRoute);

  return { app, container };
};
