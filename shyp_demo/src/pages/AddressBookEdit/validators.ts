import { isEmail } from 'validator';

export interface IFieldValidator{
  field: string;
  validate: (value: any) => string;
}

const checkBlank = (value: any):string => value === '' ? 'Can\'t be blank' : '';
const checkNull = (value: any):string => value === '' || value == null ? 'Can\'t be blank' : '';

export default {
  common: [
    // We don't count empty string as invalid, since other validators would take care of it
    { field: 'email', validate: (value: any) => (!value || isEmail(value)) ? '': 'Invalid email' }
  ],
  company: {
    editing: [
      { field: 'name', validate: checkBlank },
      { field: 'address', validate: checkBlank },
      { field: 'postal_code', validate: checkBlank },
      { field: 'city', validate: checkBlank },
      { field: 'country', validate: checkBlank },
    ],
    creation: [
      { field: 'name', validate: checkNull },
      { field: 'address', validate: checkNull },
      { field: 'postal_code', validate: checkNull },
      { field: 'city', validate: checkNull },
      { field: 'country', validate: checkNull },
    ],
  },
  person: {
    editing: [
      { field: 'name', validate: checkBlank },
      { field: 'email', validate: checkBlank },
      { field: 'phone', validate: checkBlank },
    ],
    creation: [
      { field: 'name', validate: checkNull },
      { field: 'email', validate: checkNull },
      { field: 'phone', validate: checkNull },
    ],
  }
};