import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { USER_ROUTE } from '#app/modules/user/route.js';
import { randUserName } from '@ngneat/falso';
import { expect } from 'expect';
import fastify from 'fastify';
import { StatusCodes } from 'http-status-codes';

const testContainer = await initializeContainer();

// REGISTER mocks
// testContainer.register({
//   UserModel: asValue(Promise.resolve(mockUserModel)),
// });

const { app, container } = build({
  container: testContainer,
  fastifyInstance: fastify({
    logger: false,
  }),
});

const UserModel = await container.cradle.UserModel;

describe(`POST ${USER_ROUTE}`, () => {
  before(async () => {
    await container.cradle.mongoose;
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should return Bad Request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: USER_ROUTE,
    });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('should return a valid response', async () => {
    const response = await app.inject({
      method: 'POST',
      url: USER_ROUTE,
      payload: {
        username: randUserName(),
      },
    });

    expect(response.statusCode).toBe(StatusCodes.OK);

    const count = await UserModel.countDocuments();

    expect(count).toBe(1);
  });

  it('should error on duplciate username', async () => {
    const username = randUserName();

    await app.inject({
      method: 'POST',
      url: USER_ROUTE,
      payload: {
        username,
      },
    });

    const response = await app.inject({
      method: 'POST',
      url: USER_ROUTE,
      payload: {
        username,
      },
    });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);

    const count = await UserModel.countDocuments();

    expect(count).toBe(1);
  });

  after(async () => {
    await container.dispose();
  });
});
