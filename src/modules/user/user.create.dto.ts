import { Static, Type } from '@sinclair/typebox';
import { FastifySchema, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'node:http';

export const CreateUserDto = Type.Object({
  username: Type.String({
    minLength: 3,
  }),
});

export type CreateUserDtoType = Static<typeof CreateUserDto>;

export const CreateUserOkResponseDto = Type.Object({
  id: Type.String(),
  username: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export type CreateUserOkResponseDtoType = Static<
  typeof CreateUserOkResponseDto
>;

export type CreateUserRoute = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  {
    Body: CreateUserDtoType;
  },
  FastifySchema
>;
