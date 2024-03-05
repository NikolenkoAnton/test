import { registerDecorator, ValidationOptions } from 'class-validator';

export function ValidatePositions(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidatePositions',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const seen = new Set();
          const hasDuplicates = value.some((currentObject) => {
            if (!currentObject.position) {
              return false;
            }
            return seen.size === seen.add(currentObject.position).size;
          });
          return !hasDuplicates;
        },
      },
    });
  };
}
