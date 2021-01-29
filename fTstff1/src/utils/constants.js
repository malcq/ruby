/**
 * Create options array for select
 * @param {Array<string>} options
 * @param {{[name: string]:string}} names
 */
const createOptions = (options, names) => options.map((option) => ({
  label: names[option],
  value: option
}));

export const userRoles = [
  'student',
  'user',
  'sales',
  'admin'
];

export const userRoleNames = {
  student: 'Стажёр',
  user: 'Сотрудник',
  sales: 'Sales',
  admin: 'Администратор'
};

export const userStatuses = [
  'registered',
  'active',
  'disabled'
];

export const paramsNames = {
  announcementsId: 'announcements-id'
};

export const languages = [
  'en',
  'ru'
];

export const languageNames = {
  en: 'English',
  ru: 'Русский'
};

export const languageOptions = createOptions(languages, languageNames);

export const employeePositions = [
  'developer',
  'designer'
];

export const employeePositionNames = {
  developer: 'Developer',
  designer: 'Designer'
};

export const employeePositionOptions = createOptions(employeePositions, employeePositionNames);
