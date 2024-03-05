import { Action } from 'routing-controllers';
import { ServerError } from '../helper/errors';
import { ResponseBuilder } from '../helper/responseBuilder';

export default function (action: Action, content: any) {
  const request = Object.assign(action.request.query, action.request.params, action.request.body);

  if (content instanceof ServerError) {
    return JSON.stringify(ResponseBuilder.error(request, content));
  }
  if (action.response.getHeader('content-type') === 'application/xml') {
    return content;
  }

  action.response.setHeader('Content-Type', 'application/json');

  return JSON.stringify(ResponseBuilder.success(content));
}
