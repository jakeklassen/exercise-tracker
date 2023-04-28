import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { USER_ROUTE } from '#app/modules/user/route.js';
import { User } from '#app/modules/user/user.model.js';
import { randUserName } from '@ngneat/falso';
import { expect } from 'expect';
import fastify from 'fastify';
import { StatusCodes } from 'http-status-codes';

const testContainer = await initializeContainer();

const { app, container } = build({
  container: testContainer,
  fastifyInstance: fastify({
    logger: false,
  }),
});

const UserModel = await container.cradle.UserModel;

describe(`GET ${USER_ROUTE}`, () => {
  before(async () => {
    await container.cradle.mongoose;
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should return empty array', async () => {
    const response = await app.inject({
      method: 'GET',
      url: USER_ROUTE,
    });

    expect(response.json()).toEqual([]);
  });

  it('should return array of users', async () => {
    const username = randUserName();
    await UserModel.create({
      username,
    });

    const response = await app.inject({
      method: 'GET',
      url: USER_ROUTE,
    });

    const users = response.json<User[]>();
    const [user] = users;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(users.length).toBe(1);
    expect(user.username).toBe(username);
  });

  after(async () => {
    await container.dispose();
  });
});
