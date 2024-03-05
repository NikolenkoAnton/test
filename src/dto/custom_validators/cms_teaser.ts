import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function RejectIfConditionTrue(
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'RejectIfConditionTrue',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [condition],
      options: validationOptions,
      validator: {
        validate(value: boolean, args: ValidationArguments) {
          const result = args.constraints[0](args.object);
          return !result;
        },
      },
    });
  };
}
