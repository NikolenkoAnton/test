import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import { ServerError } from '../helper/errors';
import { ResponseBuilder } from '../helper/responseBuilder';

@Service()
@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, req: any, res: any, next: () => any) {
    if (process.env.NODE_ENV === 'local') {
      console.error(error.message, error.stack);
    }
    const request = Object.assign(req.query, req.params, req.body);
    switch (true) {
      case error instanceof ServerError:
        res.send(JSON.stringify(ResponseBuilder.error(request, error)));
        break;
      case !!error.httpCode && !!error.name && !!error.message && !!error.errors:
        res.send({ ERROR: error });
        break;
      case !!error.message:
        res.send({ ERROR: error.message });
        break;
      default:
        res.send(JSON.stringify(ResponseBuilder.error(request, new ServerError())));
        break;
    }
    next();
  }
}
