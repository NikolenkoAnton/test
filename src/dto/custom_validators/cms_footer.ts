import { registerDecorator, ValidationOptions } from 'class-validator';

export function ValidateSiteDomainDuplicate(property: string, validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'ValidateSiteDomainDuplicate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const seen = new Set();
          const hasDuplicates = value.some((currentObject) => {
            if (!currentObject.site_domain_id) {
              return false;
            }
            return seen.size === seen.add(currentObject.site_domain_id).size;
          });
          return !hasDuplicates;
        },
      },
    });
  };
}
