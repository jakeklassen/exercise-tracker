import { AppCradle } from '#app/container.js';
import { USER_ROUTE } from '#app/modules/user/route.js';
import { FastifySchema, RouteOptions } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { StatusCodes } from 'http-status-codes';

declare module '#app/container.js' {
  interface AppCradle {
    userListRoute: ListUserRoute;
  }
}

type ListUserRoute = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  RouteGenericInterface,
  unknown,
  FastifySchema
>;

export const resolveUserListRoute = ({ UserModel }: AppCradle) =>
  ({
    method: 'GET',
    url: USER_ROUTE,
    schema: {
      response: {
        [StatusCodes.OK]: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              username: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },

    async handler() {
      return await UserModel.then((model) => model.find());
    },
  } as ListUserRoute);

export default resolveUserListRoute;
