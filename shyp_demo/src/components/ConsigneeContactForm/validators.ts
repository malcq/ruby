import { isEmail } from 'validator';

export interface IFieldValidator{
  field: string;
  validate: (value: any) => string;
}

const checkBlank = (value: any):string => !value ? 'Can\'t be blank' : '';

export default [
    { field: 'name', validate: checkBlank },
    { field: 'email', validate: (value: any) => (!value || !isEmail(value)) ? 'Invalid email address' : '' },
    { field: 'phone', validate: checkBlank },
];