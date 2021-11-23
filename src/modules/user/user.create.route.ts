import { AppCradle } from '#app/container.js';
import { USER_ROUTE } from '#app/modules/user/route.js';
import { FastifySchema, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

declare module '#app/container.js' {
  interface AppCradle {
    userCreateRoute: CreateUserRoute;
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

export const resolveUserCreateRoute = ({ UserModel }: AppCradle) =>
  ({
    method: 'POST',
    url: USER_ROUTE,
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

export default resolveUserCreateRoute;
