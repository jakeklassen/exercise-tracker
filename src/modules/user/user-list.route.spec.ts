import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { User } from '#app/modules/user/user.model.js';
import faker from 'faker';
import { StatusCodes } from 'http-status-codes';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const testContainer = await initializeContainer();

const userSuite = suite('GET /api/users');

const { app, container } = build({
  container: testContainer,
  fastifyServerOptions: {
    logger: false,
  },
});

const UserModel = await container.cradle.UserModel;

userSuite.before(async () => {
  await container.cradle.mongoose;
});

userSuite.before.each(async () => {
  await UserModel.deleteMany({});
});

userSuite('should return empty array', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/api/users',
  });

  assert.equal(response.json(), []);
});

userSuite('should return array of users', async () => {
  const username = faker.internet.userName();
  await UserModel.create({
    username,
  });

  const response = await app.inject({
    method: 'GET',
    url: '/api/users',
  });

  const users = response.json<User[]>();
  const [user] = users;

  assert.is(response.statusCode, StatusCodes.OK);
  assert.is(users.length, 1);
  assert.is(user.username, username);
});

userSuite.after(async () => {
  const mongoose = await container.cradle.mongoose;
  await mongoose.connection.dropDatabase();

  await container.dispose();
});

userSuite.run();
