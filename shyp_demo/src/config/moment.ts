import moment from 'moment';

export function setDefaultLocale() {
  moment.updateLocale('en', {
    week:{
      dow: 1,
      doy: 1,
    },
  });
}