import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Model } from 'sequelize';

@ValidatorConstraint({ async: true })
export class IsEntityExistsConstraint implements ValidatorConstraintInterface {
  validate(entity_id: number, args: ValidationArguments) {
    const entityModelClass = args.constraints[0];

    if (!entityModelClass) {
      return false;
    }

    return entityModelClass
      .findByPk(entity_id)
      .then((entity) => {
        if (!entity) {
          return false;
        }
        return true;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Model ${validationArguments.constraints[0].name} with id ($value) not found!Property name - ($property).`;
  }
}

export function IsEntityExists(model: typeof Model, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model],
      validator: IsEntityExistsConstraint,
    });
  };
}
