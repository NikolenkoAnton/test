import { CaptureContext } from '@sentry/types';
import * as Sentry from '@sentry/node';
import { assign } from 'lodash';
import config from '../config';

const env = process.env.NODE_ENV || 'development';

function init() {
  if (config.SENTRY_LOGGING_DISABLED) {
    return;
  }
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: env,
  });
}

function log(err, context?: CaptureContext) {
  if (config.SENTRY_LOGGING_DISABLED) {
    console.error(err);
    return;
  }
  Sentry.captureException(err, assign({ level: Sentry.Severity.Error }, context));
}

export { init, log };
