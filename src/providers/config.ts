import convict from 'convict';

declare module '#app/container.js' {
	interface AppCradle {
		config: Config;
	}
}

export interface AppConfig {
	mongo: {
		db: string;
		url: string;
	};
	port: number;
}

export const config = convict<AppConfig>({
	mongo: {
		db: {
			doc: 'Mongodb database',
			format: String,
			default: '',
			env: 'MONGO_DB',
		},
		url: {
			doc: 'Mongodb URL',
			format: String,
			default: 'mongodb://localhost/tantor',
			env: 'MONGO_URL',
		},
	},
	port: {
		doc: 'API server port',
		format: 'port',
		default: 3000,
		env: 'PORT',
	},
});

config.validate({ allowed: 'strict' });

export type Config = typeof config;

/**
 * Container resolver function
 */
export default function resolveConfig() {
	return config;
}
