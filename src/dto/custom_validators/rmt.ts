// file validators/is-bigger-than.ts
import { registerDecorator, ValidationOptions, ValidationArguments, ValidateIf } from 'class-validator';

export function IsBiggerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isBiggerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'number' && typeof relatedValue === 'number' && value > relatedValue;
        },
      },
    });
  };
}

export function IsBiggerOrEqualThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsBiggerOrEqualThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'number' && typeof relatedValue === 'number' && value >= relatedValue;
        },
      },
    });
  };
}

export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== null, validationOptions);
}
