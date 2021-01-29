import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import {
  CurrentFeedbackService,
  WidgetService,
  ThemeService,
} from './_services/index';

import { WindowRef } from './_core/window-ref';

import {
  trigger,
  style,
  transition,
  sequence,
  query as q,
  animateChild,
  group,
} from '@angular/animations';

import { ROUTES } from './config/router';

// Wrapper for query to have optional=true
export function query(s, a, o = {optional: true}) { return q(s, a, o); }

const transitions = [
  sequence([
    query(':leave, :enter', style({
      position: 'fixed',
      width: '100%',
      height: '100%',
    })),
    query(':enter', style({ transform: 'translateX(100%)' })),
    sequence([
      group([
        query(':leave', style({ transform: 'translateX(-100%)', })),
        query(':enter', style({ transform: 'translateX(0%)' })),
      ]),
      query(':enter', animateChild()),
    ])
  ])
];

const routerTransition = trigger('routerTransition', [
  transition('* => *', transitions),
]);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    routerTransition,
  ]
})
export class AppComponent implements OnInit {
  public canDone = false;
  public alertStyle: string = null;
  public innerScrollEnabled = true;
  public initialized = false;

  constructor(
    private router: Router,
    private currentFeedbackService: CurrentFeedbackService,
    private widgetService: WidgetService,
    private win: WindowRef,
    private themeService: ThemeService,
  ) {
  }

  ngOnInit() {
    forkJoin([
      this.widgetService.getConfig(),
      this.themeService.initTheme(),
      this.currentFeedbackService.removeFeedbackSessionId(),
    ])
      .pipe(
        tap(([config, theme]) => {
          // setting innerscroll configuration for css
          this.innerScrollEnabled = !config.useIphoneScrolling;
          this.initialized = true;
        }),
        mergeMap(([config]) => {
          return this.widgetService.onLoad();
        })
      )
      .subscribe(() => null);
  }

  onActivate(component) {
    if (!['/', `/${ROUTES.login}`].includes(this.router.url)) {
      this.currentFeedbackService
        .setLastUrl(this.router.url)
        .subscribe(() => null);
    }

    this.win.nativeWindow.scrollTo(0, 0);
    this.setAlertStyle(component);
  }

  setAlertStyle(component) {
    if (component.alertStyle) {
      return this.alertStyle = component.alertStyle;
    }
    this.alertStyle = null;
  }
}
