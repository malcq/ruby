import {
  animation,
  animate,
  trigger,
  transition,
  style,
} from '@angular/animations';

const DEFAULT_TIME = '0.4s';
const DEFAULT_BLUR = '3px';

export const fadeInAnimation = animation([
  style({
    opacity: '{{ startOpacity }}',
  }),
  animate('{{ time }}', style({
    opacity: '{{ endOpacity }}',
  })),
], {
  params: {
    time: DEFAULT_TIME,
    startOpacity: 0,
    endOpacity: 1,
  }
});

export const fadeOutAnimation = animation([
  animate('{{ time }}', style({
    opacity: '{{ opacity }}'
  }))
], {
  params: {
    time: DEFAULT_TIME,
    opacity: 0,
  },
});

export const blurAnimation = animation([
  animate('{{time}}', style({
    filter: 'blur({{blur}})',
  }))], {
  params: {
    blur: DEFAULT_BLUR,
    time: DEFAULT_TIME,
  },
});

export const slide = animation([
  style({
    opacity: '{{startOpacity}}',
    transform: 'translateY({{startY}}) scale({{startScale}})',
  }),
  animate('{{time}}', style({
    opacity: 1,
    transform: 'translateX({{endY}}) scale(1)',
  }))], {
  params: {
    time: DEFAULT_TIME,
    startY: '20%',
    endY: '0%',
    startScale: '0.7',
    startOpacity: '0',
  },
});
