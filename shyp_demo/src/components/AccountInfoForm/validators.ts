import { isEmail } from 'validator';

export interface IFieldValidator{
  field: string;
  validate: (value: any) => string;
}

const checkBlank = (value: any):string => value === '' ? 'Can\'t be blank' : '';
const checkNull = (value: any):string => value === '' || value == null ? 'Can\'t be blank' : '';

export default [
  { field: 'firstName', validate: checkBlank },
];