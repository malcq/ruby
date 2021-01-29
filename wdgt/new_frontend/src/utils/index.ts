import { IAction, ISelectedAction } from '../models/chat';
import { EActionStates, EFileTypes } from './constants';

// TOKEN UTILS
import { localStorageService } from '../api/local-storage';

export function getTokenFromStorage(): Promise<string | null> {
  return localStorageService.getItem('jwtToken')
    .then(token => {
      if (!token) {
        return null;
      }
      return token;
    });
};


// ACTION UTILS
export function getActionState(action: IAction, selected?: ISelectedAction): EActionStates {
  if (!selected) { return EActionStates.pristine; }

  const { id: actionId } = action;
  const { actionId: selectedId } = selected;

  if (actionId === selectedId) { return EActionStates.selected};

  return EActionStates.notSelected;
}

// Other utils ⬇️
export function getFileTypeFromFile(file: File): EFileTypes {
  const { type } = file;
  const mainType = type.split('/')[0];

  switch (mainType) {
    case 'image':
      return EFileTypes.image;
    default:
      return EFileTypes.other;
  }
}

/**
 * Converts link like `https://lenta.ru/news/2019/09/20/kalini/`
 * to `lenta.ru`
 */
export function getFancyUrl(url: string): string | null {
  const match = url.match(/^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:www\.)?([^:/?\n]+)/i);
  if (!match || !match.length) {
    return null;
  }
  return match[match.length - 1];
}

/**
 * Converts date to string (01/01/1970)
 * @param date {Date}
 */
export function getFancyDate(date: Date): string {
  let dd: number | string = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm: number | string = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy: number | string = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  return `${dd}/${mm}/${yy}`;
}
/**
 * Converts 00:00 time string to string 12:00 a.m.
 * @param date {Date}
 */
export function getFancyTime(inTime: string|undefined): string {
  if(!inTime) {
    return '';
  }
  let pm = 'a.m.'
  const timeParts = inTime.split(':');
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  if(hours>11) {
    hours -= 12;
    pm = 'p.m.';
  }

  return `${(!hours? '12': (hours<10? '0': '')+hours)}:${(minutes<10? '0': '')+minutes} ${pm}`;
}