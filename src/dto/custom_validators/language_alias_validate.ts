import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import lodash from 'lodash';
import { SiteDomain, TranslateLanguage } from '../../db/models';
import { IGenericTextItem } from './../../interface/cms-footer.interface';

const { flattenDeep, map, head, pick, isEqual, sortBy } = lodash;

export interface CustomValidationOptions extends ValidationOptions {
  validateOnlyAliases?: boolean;

  validateOnlyLanguages?: boolean;
}

@ValidatorConstraint({ async: true })
export class LanguageAliasConstraint implements ValidatorConstraintInterface {
  async validate(values: IGenericTextItem[], args: ValidationArguments) {
    const [activeLanguages, activeDomains] = await Promise.all([
      TranslateLanguage.scope('onlyActive').findAll({ raw: true }),
      SiteDomain.scope('onlyActive').findAll({ raw: true }),
    ]);

    const sortedValuesCombination = sortBy(
      map(values, (val) => pick(val, ['language_id', 'site_domain_id'])),
      ['language_id', 'site_domain_id'],
    );

    const { validateOnlyAliases, validateOnlyLanguages }: CustomValidationOptions = head(args.constraints);

    if (validateOnlyAliases) {
      const sortedActiveAlias = sortBy(
        map(activeDomains, ({ id }) => ({ site_domain_id: id })),
        ['site_domain_id'],
      );

      return isEqual(sortedActiveAlias, sortedValuesCombination);
    }

    if (validateOnlyLanguages) {
      const sortedActiveLanguages = sortBy(
        map(activeLanguages, ({ id }) => ({ language_id: id })),
        ['language_id'],
      );

      return isEqual(sortedActiveLanguages, sortedValuesCombination);
    }

    const requiredLanguageAliasCombinations = sortBy(
      flattenDeep(
        map(activeLanguages, (lang) =>
          map(activeDomains, (alias) => ({ language_id: lang.id, site_domain_id: alias.id })),
        ),
      ),
      ['language_id', 'site_domain_id'],
    );

    return isEqual(requiredLanguageAliasCombinations, sortedValuesCombination);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Languages and Aliases failed!`;
  }
}

export function LanguagesAndAliasesValidate(
  customValidationOptions: CustomValidationOptions = { validateOnlyAliases: false, validateOnlyLanguages: false },
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: customValidationOptions,
      constraints: [pick(customValidationOptions, ['validateOnlyAliases', 'validateOnlyLanguages'])],
      validator: LanguageAliasConstraint,
    });
  };
}
