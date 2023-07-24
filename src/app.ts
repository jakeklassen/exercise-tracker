import { AppCradle } from '#app/container.js';
import { AwilixContainer } from 'awilix';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb';

interface BuildOptions<App extends FastifyInstance = FastifyInstance> {
  container: AwilixContainer<AppCradle>;
  fastifyInstance: App;
}

/**
 * App factory
 */
export const build = (opts: BuildOptions) => {
  const { fastifyInstance: app, container } = opts;

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
  app.route(container.cradle.userExerciseCreateRoute);
  app.route(container.cradle.userLogListRoute);

  return { app, container };
};
