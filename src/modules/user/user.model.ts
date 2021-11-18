import { AppCradle } from '#app/container.js';
import mongoose from 'mongoose';

declare module '#app/container.js' {
  interface AppCradle {
    UserModel: Promise<mongoose.Model<User>>;
  }
}

export interface User {
  username: string;
}

const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const resolveUserModel = async ({ mongoose }: AppCradle) => {
  return (await mongoose).model('User', userSchema);
};

export default resolveUserModel;
