export interface IFieldValidator{
  field: string;
  validate: (value: any) => string;
}

const checkBlank = (value: any):string => !value ? 'Can\'t be blank' : '';

export default [
    { field: 'company_name', validate: checkBlank },
    { field: 'address', validate: checkBlank },
    { field: 'city', validate: checkBlank },
    { field: 'postal_code', validate: checkBlank },
    { field: 'country', validate: checkBlank },
];