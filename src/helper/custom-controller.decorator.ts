import { Controller, UseAfter, UseBefore, UseInterceptor } from 'routing-controllers';
import { ApiPath } from 'swagger-express-ts';
import { Service } from 'typedi';
import responseInterceptor from '../interceptor/responseInterceptor';
import { loggingAfter, loggingBefore } from '../middleware/middleware';
import { OPEN_ROUTES } from './constants';

export function DefaultController(
  path: string,
  name: string,
  interceptors: any[] = [responseInterceptor],
  openRoutes: boolean = false,
) {
  return function (target) {
    ApiPath({
      path,
      name,
      security: {
        ApiKeyAuth: [],
        basicAuth: [],
      },
    })(target);

    Service()(target);
    UseBefore(loggingBefore)(target);
    UseAfter(loggingAfter)(target);

    interceptors.forEach((interceptor) => {
      UseInterceptor(interceptor)(target);
    });

    if (openRoutes) {
      OPEN_ROUTES.add(path.replace(/\//, ''));
    }
    Controller(`${path}/`)(target);
  };
}
