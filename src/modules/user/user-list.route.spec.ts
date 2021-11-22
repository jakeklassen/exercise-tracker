import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { User } from '#app/modules/user/user.model.js';
import expect from 'expect';
import faker from 'faker';
import { StatusCodes } from 'http-status-codes';

const testContainer = await initializeContainer();

const { app, container } = build({
  container: testContainer,
  fastifyServerOptions: {
    logger: false,
  },
});

const UserModel = await container.cradle.UserModel;

describe('GET /api/users', () => {
  before(async () => {
    await container.cradle.mongoose;
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should return empty array', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/users',
    });

    expect(response.json()).toEqual([]);
  });

  it('should return array of users', async () => {
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

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(users.length).toBe(1);
    expect(user.username).toBe(username);
  });

  after(async () => {
    const mongoose = await container.cradle.mongoose;
    await mongoose.connection.dropDatabase();

    await container.dispose();
  });
});
