import convict from 'convict';

declare module '#app/container.js' {
  interface AppCradle {
    config: Config;
  }
}

interface AppConfig {
  mongoDb: string;
  mongoUrl: string;
  port: number;
}

export const config = convict<AppConfig>({
  mongoDb: {
    doc: 'Mongodb database',
    format: String,
    default: '',
    env: 'MONGO_DB',
  },
  mongoUrl: {
    doc: 'Mongodb URL',
    format: String,
    default: 'mongodb://localhost/tantor',
    env: 'MONGO_URL',
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
