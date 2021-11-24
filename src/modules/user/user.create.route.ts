import { AppCradle } from '#app/container.js';
import { USER_ROUTE } from '#app/modules/user/route.js';
import {
  CreateUserDto,
  CreateUserDtoType,
  CreateUserOkResponseDto,
  CreateUserOkResponseDtoType,
} from '#app/modules/user/user.create.dto.js';
import { FastifySchema, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { StatusCodes } from 'http-status-codes';

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
    Body: CreateUserDtoType;
    Reply: CreateUserOkResponseDtoType;
  },
  FastifySchema
>;

export const resolveUserCreateRoute = ({ UserModel }: AppCradle) =>
  ({
    method: 'POST',
    url: USER_ROUTE,
    schema: {
      body: CreateUserDto,
      response: {
        [StatusCodes.OK]: CreateUserOkResponseDto,
      },
    },

    async handler(request) {
      const user = await UserModel.then((model) =>
        model.create({
          username: request.body.username,
        }),
      );

      return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    },
  } as CreateUserRoute);

export default resolveUserCreateRoute;
