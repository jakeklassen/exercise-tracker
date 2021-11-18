import { AppCradle } from '#app/container.js';
import mongoose from 'mongoose';

declare module '#app/container.js' {
  interface AppCradle {
    mongoose: Promise<mongoose.Mongoose>;
  }
}

export const resolveDatabaseConnection = async ({ config }: AppCradle) => {
  await mongoose.connect(config.get('mongoUrl'), {
    dbName: config.get('mongoDb'),
    authSource: 'admin',
  });

  return mongoose;
};

export default resolveDatabaseConnection;
