import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import faker from 'faker';
import { StatusCodes } from 'http-status-codes';
import expect from 'expect';

const testContainer = await initializeContainer();

// REGISTER mocks
// testContainer.register({
//   UserModel: asValue(Promise.resolve(mockUserModel)),
// });

const { app, container } = build({
  container: testContainer,
  fastifyServerOptions: {
    logger: false,
  },
});

const UserModel = await container.cradle.UserModel;

describe('POST /api/users', () => {
  before(async () => {
    await container.cradle.mongoose;
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should return Bad Request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
    });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('should return a valid response', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        username: faker.internet.userName(),
      },
    });

    expect(response.statusCode).toBe(StatusCodes.OK);

    const count = await UserModel.countDocuments();

    expect(count).toBe(1);
  });

  it('should error on duplciate username', async () => {
    const username = faker.internet.userName();

    await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        username,
      },
    });

    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
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
