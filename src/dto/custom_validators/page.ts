import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidateCyrillic', async: false })
export class ValidateCyrillicConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const hasCyrillic = /[а-яА-ЯЁё]/.test(text);
    return !hasCyrillic;
  }

  defaultMessage(args: ValidationArguments) {
    return '$property contains cyrillic symbols';
  }
}

export function ValidateCyrillic(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateCyrillicConstraint,
    });
  };
}

export function ValidatePageValues(property: string, validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'ValidatePageValues',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const id = (args.object as any)['id'];
          return (id && value.length) || (!id && value.length) || (id && !value.length);
        },
      },
    });
  };
}

export function ValidateDuplicates(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ValidateDuplicates',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const seen = new Set();
          const hasDuplicates = value.some(function (currentObject) {
            return seen.size === seen.add(currentObject.language_id).size;
          });
          return !hasDuplicates;
        },
      },
    });
  };
}
