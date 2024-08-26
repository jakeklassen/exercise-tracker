import { AppCradle } from '#app/container.js';
import { USER_ROUTE } from '#app/modules/user/route.js';
import {
	UserListDto,
	UserListDtoType,
} from '#app/modules/user/user.list.dto.js';
import { FastifySchema, RouteOptions } from 'fastify';
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
	{
		Reply: UserListDtoType;
	},
	FastifySchema
>;

export const resolveUserListRoute = ({ UserModel }: AppCradle) =>
	({
		method: 'GET',
		url: USER_ROUTE,
		schema: {
			response: {
				[StatusCodes.OK]: UserListDto,
			},
		},

		async handler() {
			return await UserModel.then((model) =>
				model.aggregate([
					{
						$project: {
							username: 1,
							log: 1,
							createdAt: 1,
							updatedAt: 1,
						},
					},
				]),
			);
		},
	}) as ListUserRoute;

export default resolveUserListRoute;
