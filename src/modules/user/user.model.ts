import { AppCradle } from '#app/container.js';
import mongoose from 'mongoose';

declare module '#app/container.js' {
  interface AppCradle {
    UserModel: Promise<mongoose.Model<User>>;
  }
}

interface Exercise {
  description: string;
  duration: number;
  date?: string;
}

const exerciseSchema = new mongoose.Schema<Exercise>(
  {
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      min: 1,
      required: true,
    },
    date: {
      type: String,
      default: () => new Date().toDateString(),
    },
  },
  {
    _id: false,
  },
);

export interface User {
  _id: string;
  username: string;
  // How would I also support Document<Exercise>[]
  log: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    log: [exerciseSchema],
  },
  {
    timestamps: true,
  },
);

export const resolveUserModel = async ({ mongoose }: AppCradle) => {
  return (await mongoose).model('User', userSchema);
};

export default resolveUserModel;
