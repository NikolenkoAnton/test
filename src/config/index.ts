import dotenv from 'dotenv';
dotenv.config();

const getIntEnv = (env: string, defaultValue: number): number => {
  if (!env) {
    return defaultValue;
  }
  try {
    return parseInt(env);
  } catch (err) {
    return defaultValue;
  }
};
export default {
  PORT: getIntEnv(process.env.PORT, 5000),
  DB: {
    DATABASE: process.env.DB_DATABASE || 'betting',
    USERNAME: process.env.DB_USERNAME || 'betradar_user',
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST || 'localhost',
    PORT: getIntEnv(process.env.DB_PORT, 5432),
  },
  STREAMING_DB_URL: process.env.STREAMING_DB_URL,
  SS_API_URL: process.env.SS_API_URL || 'https://sportsbook-dev.softswiss.net/api/v2/',
  SS_KEY: process.env.SS_KEY,
  FILES_PATH: process.env.FILES_PATH || './filestore',
  SENTRY_DSN: process.env.SENTRY_DSN || 'http://e3046f0ac99941abaf8288cfa320f5e4@sentry.axiom.bet/6',
  SENTRY_LOGGING_DISABLED: process.env.SENTRY_LOGGING_DISABLED
    ? process.env.SENTRY_LOGGING_DISABLED.toLowerCase() === 'true'
    : false,
  DEFAULT_PAGINATION_SIZE: getIntEnv(process.env.DEFAULT_PAGINATION_SIZE, 25),
  CURRENCY_KEY: '8402de5b297f12af9b2174bcdf23e9b2',
  CURRENCY_URL: 'http://currency.axiom.bet/',
  EXTERNAL_BANNER_BASE_URL: process.env.EXTERNAL_BANNER_BASE_URL || 'https://todo-change-after-service-creation/',
};
