import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { format } from 'date-fns';

export function IsBeforeStartDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsBeforeStartDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const relatedValue = (args.object as any)['schedule_start_date'] || format(new Date(), 'yyyy-MM-dd');
          return value >= relatedValue;
        },
      },
    });
  };
}

export function IsTimeNotExpired(property: string, validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsTimeNotExpired',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const startDate = (args.object as any)['schedule_start_date'] || format(new Date(), 'yyyy-MM-dd');
          const finishDate = (args.object as any)['schedule_finish_date'];
          const startTime = (args.object as any)['schedule_start_time'] || format(new Date(), 'HH:mm');
          if (finishDate > startDate) {
            return true;
          }
          return startDate === finishDate && startTime < value;
        },
      },
    });
  };
}
