import { AppCradle } from '#app/container.js';
import mongoose from 'mongoose';

declare module '#app/container.js' {
  interface AppCradle {
    mongoose: Promise<mongoose.Mongoose>;
  }
}

export const resolveDatabaseConnection = async ({ config }: AppCradle) => {
  console.log(config.get('mongoUrl'));
  console.log(config.get('mongoDb'));

  await mongoose.connect(config.get('mongoUrl'), {
    autoIndex: false,
    dbName: config.get('mongoDb'),
    authSource: 'admin',
  });

  return mongoose;
};

export default resolveDatabaseConnection;
