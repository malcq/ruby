export const TIME_BETWEEN_BLOCKS = 500; //ms
export const INACTIVE_SESSION_LIFETIME = 12 * 3_600 * 1_000; //ms

export const MESSAGE_TYPES = {
  text: 'text',
  link: 'link',
};

export const ACTION_TYPES = {
  button: 'btn',
  phoneCall: 'phone_call',
  freeText: 'input',
  media: 'media',
  autocomplete: 'autocomplete',
  select: 'select',
  dataType: 'data_type',
  roller: 'roller',
  timepicker: 'timepicker',
  datepicker: 'datepicker',
  selectWithRouting: 'singleselect',
  selectLink: 'linkselect',
  fullnameForm: 'fullname',
  bicNumber: 'bic_number',
  ibanNumber: 'iban_number',
  customForm: 'custom_form',
};

const DATA_TYPE_ACTION_TYPES = {
  username: 'username',
  email: 'email',
  bookingId: 'booking_id',
  multiplePersons: 'multiple_persons',
};

export const DATA_TYPE_ERROR_MESSAGES = {
  [DATA_TYPE_ACTION_TYPES.username]: 'Incorrect User name format',
  [DATA_TYPE_ACTION_TYPES.email]: 'Incorrect email format',
  [DATA_TYPE_ACTION_TYPES.bookingId]: 'Must be 6 symbols length and contain only uppercase characters or numbers',
  [DATA_TYPE_ACTION_TYPES.multiplePersons]: 'Please enter correct names',
};

/**
 * States for input actions
 * Each action can have 3 states
 * If user doesn't select anything, it should have state `pristine`
 * If user selected an action - this action will have state `selected`
 * After selection, other actions will have `notSelected` state
 */
export enum EActionStates {
  pristine = 'pristine',
  selected = 'selected',
  notSelected = 'not-selected',
}

/**
 * States for chatblocks in chat
 * State for chatblock what available for select is `pristine`
 * State for chatblock what selected (above block) is `selected`
 */
export enum EAnimationSteps {
  pristine = 'pristine',
  selected = 'selected',
}

export enum EFileTypes {
  image = 'image',
  other = 'other'
}
/**
 * Types of heights which can be used by actions
 */
export enum EActionHeightTypes {
  fullWindow,
  big,
  default,
}

// in seconds
export const CHAT_DURATIONS = {
  chat: {
    flipAnimation: 0.5,
  },
  actions: {
    duration: 0.7,
  },
  messageList: {
    pristine: 1,
    selected: 0.8,
  }
}

type LINE_HEIGHTS_BY_SIZE_TYPE = {
  [key: string]: string
}
export const LINE_HEIGHTS_BY_SIZE: LINE_HEIGHTS_BY_SIZE_TYPE = {
  '11': '14px',
  '13': '17px',
  '15': '20px',
  '20': '24px',
  '24': '30px',
}

/**
 * Custom form constants
 */
export const CUSTOM_FORM_ERROR_MESSAGES = {
  email: DATA_TYPE_ERROR_MESSAGES[DATA_TYPE_ACTION_TYPES.email],
  username: DATA_TYPE_ERROR_MESSAGES[DATA_TYPE_ACTION_TYPES.username],
  multiple_persons: DATA_TYPE_ERROR_MESSAGES[DATA_TYPE_ACTION_TYPES.multiplePersons],
  booking_id: DATA_TYPE_ERROR_MESSAGES[DATA_TYPE_ACTION_TYPES.bookingId],
  bic_number: 'BIC number is not valid',
  iban_number: 'IBAN number is not valid',
  first_name: 'Please enter your correct first name',
  second_name: 'Please enter your correct last name',
  list: 'Input is not valid',

  // custom validator errors
  length: (length: number) => `Input should have ${length} characters`,
  only_numbers: 'Only numbers accepted',
  only_letters: 'Only letters accepted',
}

export enum ECustomFormRuleTypes {
  regex = 'regex',
  bicNumber = 'bic_number',
  ibanNumber = 'iban_number',
  list = 'list',
  length = 'length',
}