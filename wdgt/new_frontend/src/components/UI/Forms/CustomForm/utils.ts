import {
  ICustomFormField,
  ICustomFormRule,
  ICustomFormRuleLength,
  ICustomFormRuleList,
  ICustomFormRuleRegex,
} from "../../../../models/custom-form";

import {
  ECustomFormRuleTypes,
  CUSTOM_FORM_ERROR_MESSAGES
} from '../../../../utils/constants';
import * as validatorUtils from '../../../../utils/validators';

export type DynamicFormValues = {
  [data_type: string]: string,
};

type Validator = (value: string) => undefined | string;

export type ValidatorCollection = {
  [data_type: string]: Validator,
};

function getErrorMessageByType(rule: ICustomFormRule): string | undefined {
  const { error: type = '' } = rule;

  const message = (CUSTOM_FORM_ERROR_MESSAGES as any)[type];
  if (type === ECustomFormRuleTypes.length) {
    const { length } = rule as ICustomFormRuleLength;
    return message(length);
  } else {
    return message;
  }
}

function getValidatorByRule(rule: ICustomFormRule): Validator {
  const { type } = rule;
  const error = getErrorMessageByType(rule) ?? 'Field is not valid';

  switch (type) {
    case ECustomFormRuleTypes.regex:
      const { regex } = rule as ICustomFormRuleRegex;
      return validatorUtils.createRegexValidator(error, regex);
    case ECustomFormRuleTypes.bicNumber:
      return validatorUtils.createBicValidator(error);
    case ECustomFormRuleTypes.ibanNumber:
      return validatorUtils.createIbanValidator(error);
    case ECustomFormRuleTypes.list:
      const { values } = rule as ICustomFormRuleList;
      return validatorUtils.createListValidator(error, values);
    case ECustomFormRuleTypes.length:
      const { length } = rule as ICustomFormRuleLength;
      return validatorUtils.createLengthValidator(error, length);
    default:
      return () => undefined;
  }
}

function composeRules(rules: ICustomFormRule[]) {
  const validators = rules.reduce((acc: Validator[], rule) => {
    const validator = getValidatorByRule(rule);
    return [
      ...acc,
      validator,
    ];
  }, []);

  if (validators.length < 1) {
    return () => undefined;
  }

  if (validators.length === 1) {
    return validators[0];
  }

  return validatorUtils.composeValidators(
    ...validators,
  )
}

export const getValidatorByField = (field: ICustomFormField) => {
  const { rules } = field;
  const validators = composeRules(rules);
  return validators;
}

export function prepareValidators (fields: ICustomFormField[]): ValidatorCollection {
  const validatorCollection: ValidatorCollection = fields.reduce(
    (acc: ValidatorCollection, field) => {
      const validators = getValidatorByField(field);
      return {
        ...acc,
        [field.data_type]: validators,
      };
    },
    {}
  );

  return validatorCollection;
}