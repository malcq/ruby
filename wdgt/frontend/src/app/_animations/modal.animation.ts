import {
  animate,
  trigger,
  transition,
  style,
} from '@angular/animations';

export const modalAnimation = trigger('modalSlide', [
  transition('void => *', [
    style({
      transform: 'translateY(100%)'
    }),
    animate('0.4s ease-out')
  ]),
  transition('* => void', [
    animate('0.4s ease-out', style({
      transform: 'translateY(100%)'
    }))
  ]),
]);

