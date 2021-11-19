import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import faker from 'faker';
import { StatusCodes } from 'http-status-codes';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const testContainer = await initializeContainer();

// REGISTER mocks
// testContainer.register({
//   UserModel: asValue(Promise.resolve(mockUserModel)),
// });

const userSuite = suite('/api/users');

const { app, container } = build({
  container: testContainer,
  fastifyServerOptions: {
    logger: false,
  },
});

const UserModel = await container.cradle.UserModel;

userSuite.before.each(async () => {
  await UserModel.deleteMany({});
});

userSuite('should return Bad Request', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/users',
  });

  assert.is(response.statusCode, StatusCodes.BAD_REQUEST);
});

userSuite('should return a valid response', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      username: faker.internet.userName(),
    },
  });

  assert.is(response.statusCode, StatusCodes.OK);

  const count = await UserModel.countDocuments({});

  assert.is(count, 1);
});

userSuite('should error on duplciate username', async () => {
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

  assert.is(response.statusCode, StatusCodes.BAD_REQUEST);

  const count = await UserModel.countDocuments({});

  assert.is(count, 1);
});

userSuite.after(async () => {
  const mongoose = await container.cradle.mongoose;
  await mongoose.connection.dropDatabase();

  await container.dispose();
});

userSuite.run();
