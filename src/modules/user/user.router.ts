import { AppCradle } from '#app/container.js';
import { FastifySchema, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

declare module '#app/container.js' {
  interface AppCradle {
    userRouter: CreateUserRoute;
  }
}

type CreateUserRoute = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  {
    Body: {
      username: string;
    };
  },
  FastifySchema
>;

export const resolveUserRouter = ({ UserModel }: AppCradle) =>
  ({
    method: 'POST',
    url: '/api/users',
    schema: {
      body: {
        username: {
          type: ['string'],
        },
      },
    },

    async handler(request) {
      return await UserModel.then((model) => {
        return model.create({
          username: request.body.username,
        });
      });
    },
  } as CreateUserRoute);

export default resolveUserRouter;
