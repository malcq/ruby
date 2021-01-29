import { Injectable } from '@angular/core';
import { Observable ,  of } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators'

import { Theme } from '../_models/theme';
import { themes, THEME_NAMES } from '../config/companies';
import { WidgetService } from './widget.service';

const DEFAULT_THEME = THEME_NAMES.default;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    private widgetService: WidgetService
  ) { }

  initTheme(): Observable<Theme> {
    return this.widgetService
      .getConfig()
      .pipe(
        mergeMap((config = {}) => {
          const theme = this.getThemeByConfig(config)
          return of(theme);
        }),
        tap((theme: Theme) => {
          this.insertThemeIntoDom(theme);
        })
      );
  }

  private insertThemeIntoDom(theme: Theme): void {
    console.log('>>in inserting', theme)
    const themeContainer = document.body;
    Object.keys(theme).forEach((key) => {
      const value = theme[key];
      themeContainer.style.setProperty(`--${key}`, value);
    });
  }

  /**
   * We should consider, that client can assign object to the theme
   * that's why we use `any` and typecheck theme field
   */
  private getThemeByConfig(config: any = {}): Theme {
    const { theme = DEFAULT_THEME } = config;
    if (typeof theme === 'string' && Object.keys(THEME_NAMES).includes(theme)) {
      return themes[theme];
    }

    return themes[DEFAULT_THEME];
  }
}
