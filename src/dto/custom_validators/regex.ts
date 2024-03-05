import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidateTextEditor', async: false })
export class ValidateTextEditorValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const hasForbiddenTags =
      /<\/?(?!(?:p|strong|em|span|ul|li|ol|h1|h2|h3|h4|h5|h6)\b)[a-z](?:[^>"']|"[^"]*"|'[^']*')*>/gi.test(text);
    return !hasForbiddenTags;
  }

  defaultMessage() {
    return '$property contains forbidden html tags. Allowed tags: <p> <strong> <em> <span> <ul> <li> <ol> <h1> <h2> <h3> <h4> <h5> <h6>';
  }
}

export function ValidateTextEditor(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateTextEditorValidator,
    });
  };
}
