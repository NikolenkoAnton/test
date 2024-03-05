import { ValidationError } from "sequelize";

export interface ErrorsData {
  property: string;
  constraints: string[];
}

export interface ErrorsExposedData {
  target: {
    [key: string]: string;
  };
  value?: string | number | null;
  property: string;
  children: any[];
  constraints: {
    [key: string]: string;
  };
}

export class ServerError extends Error {
  name = 'InternalServerError';
  message = 'No data';
  status = 500;
  errors: ErrorsData[] = [];
}

export class DatafixerConnectionError extends ServerError {
  name: string = DatafixerConnectionError.name;
  status = 11;

  constructor(message = 'Request to datafixer failed', errors: ErrorsData[] = []) {
    super();
    this.message = message;
    this.errors = errors;
  }
}

export class SoftswissConnectionError extends ServerError {
  name: string = SoftswissConnectionError.name;
  status = 11;

  constructor(message = 'Request to softswiss failed', errors: ErrorsData[] = []) {
    super();
    this.message = message;
    this.errors = errors;
  }
}

export class NoDataError extends ServerError {
  name: string = NoDataError.name;
  status = 10;

  constructor(message = 'No data', errors: ErrorsData[] = []) {
    super();
    this.message = message;
    this.errors = errors;
  }
}

export class SaveError extends ServerError {
  name: string = SaveError.name;
  status = 10;

  constructor(message = 'Save error', errors: ErrorsData[] = []) {
    super();
    this.message = message;
    this.errors = errors;
  }
}

export class NotFoundError extends ServerError {
  name: string = NotFoundError.name;
  status = 404;

  constructor(message = 'Entity is not found', errors: ErrorsData[] = []) {
    super();
    this.message = message;
    this.errors = errors;
  }
}

export class NotAuthorizedError extends ServerError {
  name: string = NotAuthorizedError.name;
  status = 401;

  constructor(message = 'Not authorized', errors: ErrorsData[] = []) {
    super();
    this.message = message;
    this.errors = errors;
  }
}

export class ForbiddenError extends ServerError {
  name: string = ForbiddenError.name;
  status = 403;

  constructor(message = 'Forbidden', errors: ErrorsData[] = []) {
    super();
    this.message = message;
    this.errors = errors;
  }
}

export class BadRequestError extends ServerError {
  name: string = BadRequestError.name;
  status = 400;

  constructor(message = 'Wrong data passed', errors: ErrorsData[] = []) {
    super();
    this.message = message;
    this.errors = errors;
  }
}

export function handleSequilizeValidationErrorMessage(err: ValidationError) {
  return err.errors.map(e => e.message).join(". ")
}