import iban from 'iban';
import { IListOption } from '../models/custom-form';

export function createRequiredValidator(errorMessage: string) {
  return (value: string): string | undefined => {
    return value ? undefined : errorMessage;
  };
}

export function createRegexValidator(errorMessage: string, regexString: string) {
  const regex = new RegExp(regexString);
  return (value: string) => {
    if (!value) { return errorMessage; }
    if (!value.trim()) { return errorMessage; }
    const isValid = regex.test(value);
    return isValid ? undefined : errorMessage;
  }
}

export function createNameValidator(errorMessage: string) {
  const regex = /^\s*[a-zA-Z\x7f-\xff][^0-9#&<>\"~,;$^%{}?]+$/;
  return (value: string): string | undefined => {
    const isValid = regex.test(value);
    return isValid ? undefined : errorMessage;
  }
}

export function createBicValidator(errorMessage: string) {
  const regex = /^([A-Z]{6}[A-Z2-9][A-NP-Z1-9])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/;
  return (value: string): string | undefined => {
    if (!value) { return errorMessage; }
    const isValid = regex.test(value.trim());
    return isValid ? undefined : errorMessage;
  }
}

export function createIbanValidator(errorMessage: string) {
  return (value: string): string | undefined => {
    if (!value) { return errorMessage; }
    const isValid = iban.isValid(value.trim());
    return isValid ? undefined : errorMessage;
  }
}

export function createListValidator (errorMessage: string, values: IListOption[]) {
  return (value: string) => {
    if (!value) { return errorMessage; }
    
    const trimmedValue = `${value}`.trim().toLowerCase();
    if (!trimmedValue) { return errorMessage; }
  
    const isInside = values.some((item) => {
      const { title } = item;
      return `${title}`.toLowerCase().trim() === trimmedValue;
    });
  
    return isInside ? undefined : errorMessage
  }
}

export function createLengthValidator(errorMessage: string, length: number) {
  return (value: string) => {
    if (!value || !value.trim()) { return errorMessage; }
    return value.trim().length === length ? undefined : errorMessage;
  }
}

export function composeValidators(...validators: any[]) {
  return (value: any) => {
    return validators.reduce((error, validator) => error || validator(value), undefined);
  };
}
