import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { USER_EXERCISE_CREATE_ROUTE } from '#app/modules/user-exercise/user-exercise.create.route.js';
import { USER_LOG_LIST_ROUTE } from '#app/modules/user-log/user-log.list.route.js';
import { USER_ROUTE } from '#app/modules/user/route.js';
import { User } from '#app/modules/user/user.model.js';
import expect from 'expect';
import faker from 'faker';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

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

describe(`GET ${USER_LOG_LIST_ROUTE}`, () => {
  let user: User;

  before(async () => {
    await container.cradle.mongoose;
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});

    user = await app
      .inject({
        method: 'POST',
        url: USER_ROUTE,
        payload: {
          username: faker.internet.userName(),
        },
      })
      .then((res) => res.json<User>());
  });

  it('should return Not Found response', async () => {
    const userId = new ObjectId().toString();
    const url = USER_LOG_LIST_ROUTE.replace(':id', userId);

    const response = await app.inject({
      method: 'GET',
      url,
    });

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  it('should have 0 exercises', async () => {
    const url = USER_LOG_LIST_ROUTE.replace(':id', user._id);

    const response = await app.inject({
      method: 'GET',
      url,
    });

    const log = response.json();

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(log._id).toBe(user._id);
    expect(log.username).toBe(user.username);
    expect(log.count).toBe(0);
    expect(log.log.length).toBe(0);
  });

  it('should have 1 exercise', async () => {
    const url = USER_LOG_LIST_ROUTE.replace(':id', user._id);

    const payload = {
      description: 'run',
      duration: 22,
      date: new Date(2021, 11, 20).toDateString(),
    };

    await app.inject({
      method: 'POST',
      url: USER_EXERCISE_CREATE_ROUTE.replace(':id', user._id),
      payload,
    });

    const response = await app.inject({
      method: 'GET',
      url,
    });

    const log = response.json();

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(log._id).toBe(user._id);
    expect(log.username).toBe(user.username);
    expect(log.count).toBe(1);
    expect(log.log.length).toBe(1);
  });

  after(async () => {
    await container.dispose();
  });
});
