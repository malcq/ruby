import moment from 'moment';
import { createSelector } from 'reselect';

import config from 'config';
import defaultAvatar from 'ui/images/defaultAvatar.svg';

const dateFormat = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
};

const dates = new Set();
const hours = [...Array(23).keys()];

export const passwordIdentity = (password, retry) => {
  switch (retry) {
    case '':
      return null;

    case password:
      return 'success';

    default:
      return 'error';
  }
};

export const createDateForExtraHours = (date) => {
  return moment(date, 'YYYY-MM-DD').format();
};

export const createHours = (date) => {
  const newdDate = moment(date);
  return `${newdDate.hour() > 9 ? newdDate.hour() : `0${newdDate.hour()}`}:${
    newdDate.minute() > 9 ? newdDate.minute() : `0${newdDate.minute()}`
  }`;
};

export const createPrettiedRange = (start, end) => {
  return `${moment(start).format('HH:mm')}-${moment(end).format('HH:mm')} `;
};

export const passwordIdentityMUI = (password, retry) => {
  switch (retry) {
    case '':
      return null;

    case password:
      return false;

    default:
      return true;
  }
};

export const getDate = (date, dataOf, type = null) => {
  let str = '';

  if (dataOf === 'server') {
    if (!date.dateFrom && date.dateTo) {
      str = `до ${new Date(date.dateTo).toLocaleString('ru', dateFormat)}`;
    }

    if (date.dateFrom && !date.dateTo) {
      str = `${new Date(date.dateFrom).toLocaleString('ru', dateFormat)}`;
    }

    if (date.dateFrom && date.dateTo) {
      if (type === 'timeOff') {
        str = `
        c ${moment(date.dateFrom).format('DD.MM.YYYY HH:mm')}
        по ${moment(date.dateTo).format('DD.MM.YYYY HH:mm')}`;
        return str;
      }

      str = `
      c ${moment(date.dateFrom).format('DD.MM.YYYY')}
      по ${moment(date.dateTo).format('DD.MM.YYYY')}`;
    }
  }

  if (dataOf === 'send') {
    if (Array.isArray(date)) {
      for (let i = 0; i < date.length; i++) {
        str += date[i].toLocaleString('ru', dateFormat);
        if (i !== date.length - 1) {
          str += ', ';
        }
      }
    }
    if (date.from !== undefined) {
      str = `
        c ${date.from.toLocaleString('ru', dateFormat)}
        по ${date.to.toLocaleString('ru', dateFormat)}
      `;
    }
    if (typeof date.getMonth === 'function') {
      str = `до ${date.toLocaleString('ru', dateFormat)}`;
    }
  }

  return str;
};

export const getName = (user) => {
  if (user) {
    const { firstName = '', lastName = '', login = 'Fusya' } = user;
    if (!firstName && !lastName) {
      return login;
    }
    return `${firstName} ${lastName}`;
  }
  return '';
};

export const getFullName = (user) => {
  const name = getName(user);
  return name === user.login ? ` (${name})` : ` ${name} (${user.login})`;
};

export const createDataChart = ({
  statisticsType = [],
  groupStatistics = []
} = {}) => {
  if (!Object.keys(statisticsType).length) {
    return [];
  }
  return [
    {
      name: 'Отгулы',
      value: statisticsType.dayOff,
      days: getQuantityDay(groupStatistics.dayOff)
    },
    {
      name: 'Больничные',
      value: statisticsType.medical,
      days: getQuantityDay(groupStatistics.medical)
    },
    {
      name: 'Технические',
      value: statisticsType.technical,
      days: getQuantityDay(groupStatistics.technical)
    },
    {
      name: 'Отпуска',
      value: statisticsType.vacation,
      days: getQuantityDay(groupStatistics.vacation)
    },
    {
      name: 'Документы',
      value: statisticsType.documents,
      days: getQuantityDay(groupStatistics.documents)
    },
    {
      name: 'Бытовые',
      value: statisticsType.common,
      days: getQuantityDay(groupStatistics.common)
    }
  ];
};

export const getQuantityDay = (statistics) => {
  if (statistics) {
    const result = statistics.reduce((sum, item) => {
      if (!item.dateFrom || !item.dateTo) {
        return sum + 1;
      }
      const duration = item.rest_days_number;
      return sum + duration;
    }, 0);
    return getStringForDay(result);
  }
  return getStringForDay(0);
};

export const getStringForDay = (quantity) => {
  if (!quantity || quantity > 4) {
    return ` ${quantity} дней`;
  }
  if (quantity > 1 && quantity < 5) {
    return ` ${quantity} дня`;
  }
  return ` ${quantity} день`;
};

export const avatarSelector = createSelector(
  (avatar) => avatar,
  (avatar) => {
    if (!avatar) {
      return defaultAvatar;
    }
    if (avatar.includes(config.url)) {
      return avatar;
    }
    return `${config.url}${avatar}`;
  }
);

// TODO: make union method imageSelector
export const technologyImageSelector = createSelector(
  (path) => path,
  (path) => {
    let newPath = path;
    if (!newPath) {
      newPath = '/public/uploads/technology_icons/no_image.svg';
    }
    if (newPath.includes(config.url)) {
      return newPath;
    }
    return `${config.url}${newPath}`;
  }
);

export const getValueFromSelect = (selected) => {
  if (!Array.isArray(selected)) {
    const name = selected.label.split('(')[0].trim();
    return { name, id: selected.value };
  }
  return selected.map((el) => el.value);
};

export const getLabelFromSelect = (selected) => {
  if (!Array.isArray(selected)) {
    return selected.label.split('(')[0].trim();
  }
  return selected.map((item) => item.label);
};

export const dateToString = (date) => {
  if (!date) {
    return '';
  }
  return moment(date).format('DD.MM.YYYY');
};

export const createDateFromDate = (date, { day = 'last' } = {}) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    day === 'last' ? moment(date).daysInMonth() : +day,
    day === '1' ? 0 : 23
  );
};

export const getPrettiedData = createSelector(
  (requests) => requests,
  (requests, needDays) => needDays,
  (requests, needDays) => {
    const data = [];
    requests.forEach((el) => {
      const {
        dateFrom: dateFromString = '',
        dateTo: dateToString = '',
        rest_days_number: dateRestNumber = 0,
        users = [],
        dates
      } = el;
      const dateFrom = dateFromString ? new Date(dateFromString) : '';
      const dateTo = dateToString ? new Date(dateToString) : '';
      const rest_days_number = dateRestNumber || 0;
      const name = getName(users[0]);
      if (!dateFrom && !dateTo && dates) {
        if (needDays) {
          dates.forEach((date) => {
            data.push({ name, dateFrom: date, dateTo: date, dates });
          });
        } else {
          data.push({ name, dateFrom: dates[0], dateTo: dates[0], dates });
        }
      }
      // If Vacation includes in 2 months
      if (dateFrom && dateTo && dateTo.getMonth() !== dateFrom.getMonth()) {
        const newDateEnd = createDateFromDate(dateFrom);
        const newDateStart = createDateFromDate(dateTo, { day: '1' });
        if (needDays) {
          data.push({ name, dateFrom, dateTo: newDateEnd, rest_days_number });
          data.push({ name, dateFrom: newDateStart, dateTo, rest_days_number });
        } else {
          data.push({ name, dateFrom, dateTo, rest_days_number });
        }
      }

      if (dateFrom && dateTo && dateTo.getMonth() === dateFrom.getMonth()) {
        data.push({ name, dateFrom, dateTo, rest_days_number });
      }

      if (!dateFrom && !dates) {
        data.push({ name, dateFrom: dateTo, dateTo, rest_days_number });
      }
    });
    return data;
  }
);

export const getValueByMonth = createSelector(
  [(data) => data.months, (data) => data.data],
  (months, data) => {
    const valueMonths = months.map((el) => el.value);
    return data.filter((el) => {
      const { dateTo = new Date() } = el;
      const monthToDate = dateTo.getMonth() + 1;
      return valueMonths.includes(monthToDate);
    });
  }
);

export const getPrettyString = (str) => {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
};

export const getDateAgoWord = (value, type) => {
  const words = {
    days: ['день', 'дня', 'дней'],
    months: ['месяц', 'месяца', 'месяцев'],
    years: ['год', 'года', 'лет']
  };
  const strValue = `${value}`;
  if (
    value === 1 ||
    (+strValue.slice(-1) === 1 &&
      ((+strValue[0] > 1 && strValue.length < 3) || strValue.length > 2))
  ) {
    return `${value} ${words[type][0]}`;
  }
  if (
    (value > 1 && value < 5) ||
    (+strValue.slice(-1) > 1 &&
      +strValue.slice(-1) < 5 &&
      ((+strValue[0] > 1 && strValue.length < 3) || strValue.length > 2))
  ) {
    return `${value} ${words[type][1]}`;
  }
  return `${value} ${words[type][2]}`;
};

export const requestStatusColor = {
  wait: {},
  inProgress: {
    color: '#337ab7'
  },
  accept: {
    color: '#5cb85c'
  },
  denied: {
    color: '#d9534f'
  },
  completed: {
    color: '#5cb85c'
  }
};

export const userRole = {
  user: 'Пользователь',
  sales: 'Sales менеджер',
  admin: 'Администратор',
  student: 'Стажёр'
};

export const userStatus = {
  registered: 'Зарегистрирован',
  active: 'Активен',
  disabled: 'Отключён'
};

export const calcBusinessDays = (dDate1, dDate2 = new Date()) => {
  const start = moment(dDate1, 'YYYY-MM-DD');
  const end = moment(dDate2, 'YYYY-MM-DD');
  return end.diff(start, 'days');
};

export const getModalStyle = ({ left = '50%', top = '50%' } = {}) => {
  return {
    left,
    top,
    transform: `translateY(-${left}) translateX(-${top})`,
    maxHeight: '90%',
    overflow: 'auto',
  };
};

export const formatDataForCalendar = (
  { createdAt, end, hidden, id, title, user, description, type } = {},
  { announcements = true } = {}
) => {
  const date = new Date(createdAt);
  const day = date.getDate();
  const hour = date.getHours();
  const key = `${day}/${hour}`;
  const data = {
    id,
    title: `${title} от ${getName(user)}`,
    desc: description,
    type
  };
  // Если с таким днем/часом нету нескрытого объявления
  if (!hidden && !dates.has(key)) {
    dates.add(key);
    return { ...data, start: date, end: announcements ? date : end };
  }
  // Если с таким днем/часом есть объявление
  if (!hidden && dates.has(key)) {
    for (let index = 0; index < hours.length; index++) {
      if (!dates.has(`${day}/${hours[index]}`)) {
        dates.add(`${day}/${hours[index]}`);
        date.setHours(hours[index]);
        return { ...data, start: date, end: announcements ? date : end };
      }
    }
  }
  return undefined;
};

export default () => null;
