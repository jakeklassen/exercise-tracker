import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { USER_EXERCISE_CREATE_ROUTE } from '#app/modules/user-exercise/user-exercise.create.route.js';
import { USER_ROUTE } from '#app/modules/user/route.js';
import { User } from '#app/modules/user/user.model.js';
import faker from '@faker-js/faker';
import expect from 'expect';
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

describe(`POST ${USER_EXERCISE_CREATE_ROUTE}`, () => {
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
    const url = USER_EXERCISE_CREATE_ROUTE.replace(':id', userId);

    const response = await app.inject({
      method: 'POST',
      url,
      payload: {
        description: 'run',
        duration: 22,
      },
    });

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  it('should return Bad Request response', async () => {
    const userId = new ObjectId().toString();
    const url = USER_EXERCISE_CREATE_ROUTE.replace(':id', userId);

    const response = await app.inject({
      method: 'POST',
      url,
    });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('should return a valid response', async () => {
    const url = USER_EXERCISE_CREATE_ROUTE.replace(':id', user._id);

    const description = 'run';
    const duration = 22;

    const response = await app.inject({
      method: 'POST',
      url,
      payload: {
        description,
        duration,
      },
    });

    const exercise = response.json();

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(exercise._id).toBe(user._id);
    expect(exercise.username).toBe(user.username);
    expect(exercise.description).toBe(description);
    expect(exercise.duration).toBe(duration);
    expect(exercise.date).toBe(new Date().toDateString());
  });

  it('should accept user provided `date` value', async () => {
    const url = USER_EXERCISE_CREATE_ROUTE.replace(':id', user._id);

    const payload = {
      description: 'run',
      duration: 22,
      date: new Date(2021, 11, 20).toDateString(),
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload,
    });

    const exercise = response.json();

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(exercise._id).toBe(user._id);
    expect(exercise.username).toBe(user.username);
    expect(exercise.description).toBe(payload.description);
    expect(exercise.duration).toBe(payload.duration);
    expect(exercise.date).toBe(payload.date);
  });

  after(async () => {
    await container.dispose();
  });
});
