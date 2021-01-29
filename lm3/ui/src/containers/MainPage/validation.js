import { ValidationUtils } from 'utils';

const validate = values => ValidationUtils.validate(values, {
  email: {
    presence: {
      allowEmpty: false,
      message: 'Email is required',
    },
  },
  firstName: {
    presence: {
      allowEmpty: false,
      message: 'firstName is required',
    },
  },
});

const validateAsync = values => ValidationUtils.validateAsync(values, {
  phone: {
    presence: {
      allowEmpty: false,
      message: 'Phone is required',
    },
  },
  email: {
    presence: {
      allowEmpty: false,
      message: 'Email is required',
    },
    email: {
      message: 'Email is invalid',
    },
  },
  firstName: {
    presence: {
      allowEmpty: false,
      message: 'firstName is required',
    },
  },
  password: {
    presence: {
      allowEmpty: false,
      message: 'Password is required',
    },
    length: {
      minimum: 8,
      message: 'Password min length is 8',
    },
  },
  passwordConfirmation: {
    presence: {
      allowEmpty: false,
      message: 'Password confirmation is required',
    },
    equality: {
      attribute: 'password',
      message: 'Passwords are not equal',
    },
  },
}, { fullMessages: false });
export {
  validate,
  validateAsync,
};
