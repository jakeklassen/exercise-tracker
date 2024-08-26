import { AppCradle } from '#app/container.js';
import { FastifySchema, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { StatusCodes } from 'http-status-codes';

export const USER_LOG_LIST_ROUTE = '/api/users/:id/logs';

declare module '#app/container.js' {
	interface AppCradle {
		userLogListRoute: GetUserExerciseLogRoute;
	}
}

type GetUserExerciseLogRoute = RouteOptions<
	Server,
	IncomingMessage,
	ServerResponse,
	{
		Params: {
			id: string;
		};
	},
	FastifySchema
>;

export const resolveGetUserExerciseLogRoute = ({ UserModel }: AppCradle) =>
	({
		method: 'GET',
		url: USER_LOG_LIST_ROUTE,
		schema: {
			params: {
				id: {
					type: ['string'],
				},
			},
		},

		async handler(request, reply) {
			return await UserModel.then(async (model) => {
				const user = await model.findById(request.params.id);

				if (user == null) {
					return reply.status(StatusCodes.NOT_FOUND).send({
						message: 'Unknown user id',
					});
				}

				const response = {
					_id: user._id,
					count: user.log.length,
					log: user.log,
					username: user.username,
				};

				return response;
			});
		},
	}) as GetUserExerciseLogRoute;

export default resolveGetUserExerciseLogRoute;
