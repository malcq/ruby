import { ValidationUtils } from 'utils';

import merge from 'lodash/merge';

const defaultRules = {
  firstName: {
    presence: {
      allowEmpty: false,
    },
  },
  lastName: {
    presence: {
      allowEmpty: false,
    },
  },
  email: {
    presence: {
      allowEmpty: false,
    },
    email: true,
  },
  phoneCode: {
    presence: {
      allowEmpty: false,
    },
  },
  phone: {
    presence: {
      allowEmpty: false,
    },
    format: {
      pattern: /\(\d{3}\)\s\d{3}-\d{4}/,
      flags: 'i',
      message: 'is not valid',
    },
  },
  role: {
    presence: {
      allowEmpty: false,
    },
  },
  password: {
    length: {
      minimum: 8,
    },
  },
  passwordConfirmation: {
    equality: {
      attribute: 'password',
    },
  },
};

const validate = (values, rules = {}) => ValidationUtils.validate(values, merge({}, defaultRules, rules));

const validateAsync = values => ValidationUtils.validateAsync(values, {
  phoneCode: {
    uniquePhone: {
      attribute: 'phone',
    },
  },
  phone: {
    uniquePhone: {
      attribute: 'phoneCode',
    },
  },
});

export {
  validate,
  validateAsync,
};
