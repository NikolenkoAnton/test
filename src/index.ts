import '../swagger/swagger-models.register'; // to init swagger models definitions before swagger serving
import config from './config';
import './db';

import express, { Express } from 'express';

import cors from 'cors';
import httpContext from 'express-http-context';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import * as swagger from 'swagger-express-ts';
import { Container } from 'typedi';
import swagger_config from '../swagger/config';
import runCron from './console';
import controllers from './controller';
import { init as initSentry, log } from './helper/sentry';
import { GlobalErrorHandler } from './middleware/global-error-handler';
import { permissionsCheck, unlessIncludes, userAuth } from './middleware/middleware';
const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(httpContext.middleware);

app.use('/filestore', express.static(config.FILES_PATH));
app.use(swagger.express(swagger_config));

useContainer(Container, { fallback: true });

app.use(userAuth);
app.use(unlessIncludes('swagger', permissionsCheck));
useExpressServer(app, {
  controllers,
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false,
});

initSentry();
runCron();

app.listen(config.PORT, async () => {
  console.log(`Running on port ${config.PORT}. Env: ${process.env.NODE_ENV}`);
});

process.on('uncaughtException', function (error) {
  log(error);
});
