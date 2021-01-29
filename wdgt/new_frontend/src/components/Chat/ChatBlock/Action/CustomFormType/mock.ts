import { ICustomFormField } from '../../../../../models/custom-form';

export const formMock: ICustomFormField[] = [
  {
    id: '1',
    data_type: 'email', // same for username, first_name, last_name
    placeholder: 'enter email address',
    rules: [
      {
        id: '1231',
        type: 'regex',
        regex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.source,
        error: 'email'
      }
    ],
  },
  {
    id: '2',
    data_type: 'list',
    placeholder: 'some placeholder',
    rules: [
      {
        id: '2121',
        type: 'list',
        values: Array.from({length: 10_000}, (_, i) => ({ title: `Item ${i + 1}`, id: `Item ${i + 1}`})),
        error: 'list',
      }
    ]
  },
  // {
  //   data_type: 'bic_number',
  //   placeholder: 'enter bic number',
  //   rules: [
  //     {
  //       type: 'bic_number',
  //       error: 'bic_number',
  //     }
  //   ]
  // },
  // {
  //   data_type: 'iban_number',
  //   placeholder: 'enter iban number',
  //   rules: [
  //     {
  //       type: 'iban_number',
  //       error: 'iban_number',
  //     }
  //   ]
  // },
  // {
  //   // custom field description
  //   placeholder: 'enter ticker number',
  //   data_type: 'ticket',
  //   rules: [
  //     {
  //       type: 'regex',
  //       regex: /only_numbers_regex/,
  //       error: 'only_numbers'
  //     },
  //     {
  //       type: 'length',
  //       length: 8,
  //       error: 'length',
  //     },
  //   ]
  // }
]