import { AppCradle } from '#app/container.js';
import assert from 'assert';
import { FastifySchema, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { StatusCodes } from 'http-status-codes';

export const ROUTE = '/api/users/:id/exercises';

declare module '#app/container.js' {
  interface AppCradle {
    userExerciseCreateRoute: CreateUserExerciseRoute;
  }
}

type CreateUserExerciseRoute = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  {
    Params: {
      id: string;
    };
    Body: {
      description: string;
      duration: number;
      date?: string;
    };
  },
  FastifySchema
>;

export const resolveUserExerciseCreateRoute = ({ UserModel }: AppCradle) =>
  ({
    method: 'POST',
    url: ROUTE,
    schema: {
      body: {
        description: {
          type: ['string'],
        },
        duration: {
          type: ['integer'],
        },
        date: {
          type: ['string', 'null'],
        },
      },
    },

    async handler(request, reply) {
      return await UserModel.then(async (model) => {
        const user = await model.findByIdAndUpdate(
          request.params.id,
          {
            $push: {
              log: request.body,
            },
          },
          {
            new: true,
          },
        );

        if (user == null) {
          return reply.status(StatusCodes.NOT_FOUND).send({
            message: 'Unknown user id',
          });
        }

        const exercise = user.log.pop();

        assert.ok(exercise);

        const response = {
          ...exercise.toJSON(),
          _id: user._id,
          username: user.username,
        };

        return response;
      });
    },
  } as CreateUserExerciseRoute);

export default resolveUserExerciseCreateRoute;
