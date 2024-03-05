import { ServerError, ErrorsExposedData, ErrorsData } from './errors';

export interface ErrorResponse {
  ERROR: {
    httpCode: number; // result code
    name: string; // name of the error
    message: string; // message
    errors: ErrorsExposedData[];
  };
}

const CONSTRAINTS_MAP = {
  required: 'Field is required',
  bool_smallint: 'Acceptable values are 0 OR 1',
  unique: 'Such value already exists',
  not_editable: 'Field is not editable',
  is_array: 'Field must be an array',
};

const exposeError = (target, errorsData: ErrorsData): ErrorsExposedData => {
  const errorExposedData: ErrorsExposedData = {
    target,
    property: errorsData.property,
    value: target[errorsData.property],
    children: [],
    constraints: {},
  };

  for (const constraint of errorsData.constraints) {
    if (!CONSTRAINTS_MAP[constraint]) {
      errorExposedData.constraints[constraint] = 'Unknown constraint';
      continue;
    }
    errorExposedData.constraints[constraint] = CONSTRAINTS_MAP[constraint];
  }

  return errorExposedData;
};

export class ResponseBuilder {
  static error(request: any, content: ServerError) {
    const errorResponse: ErrorResponse = {
      ERROR: {
        httpCode: content.status ? content.status : 10,
        name: content.name,
        message: content.message,
        errors: [],
      },
    };
    if (content.errors) {
      const errors: ErrorsExposedData[] = [];
      for (const error of content.errors) {
        errors.push(exposeError(request, error));
      }
      errorResponse.ERROR.errors = errors;
    }

    return errorResponse;
  }

  static success(data: any) {
    return {
      data: data,
    };
  }
}
