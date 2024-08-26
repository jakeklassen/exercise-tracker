import { AppCradle } from '#app/container.js';
import mongoose from 'mongoose';

declare module '#app/container.js' {
	interface AppCradle {
		mongoose: Promise<mongoose.Mongoose>;
	}
}

export const resolveDatabaseConnection = async ({ config }: AppCradle) => {
	mongoose.set('strictQuery', false);

	await mongoose.connect(config.get('mongo.url'), {
		autoIndex: false,
		dbName: config.get('mongo.db'),
		authSource: 'admin',
	});

	return mongoose;
};

export default resolveDatabaseConnection;
