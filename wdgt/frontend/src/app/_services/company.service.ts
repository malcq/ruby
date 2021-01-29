import { Injectable } from '@angular/core';
import { Observable ,  of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
// import { companies } from '../../environments/companies';
import { COMPANY_NAMES, companies } from '../config/companies';
import { WidgetService } from '../_services/widget.service';
import { Company } from '../_models';

const DEFAULT_COMPANY_NAME = COMPANY_NAMES.threeBack;

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  companyName: string = null;

  constructor(
    private widgetService: WidgetService,
  ) { }

  initCompany(): Observable<Company> {
    return this.widgetService
      .getConfig()
      .pipe(
        mergeMap((config) => {
          this.companyName = config.company || DEFAULT_COMPANY_NAME;
          return of(this.activeCompany);
        }),
      );
  }

  get activeCompany(): Company {
    if (!this.companyName) { return null; }
    return companies[this.companyName];
  }

  /**
   * Legacy adapter to be able get company in observable
   */
  getAsync(): Observable<Company> {
    if (this.companyName) {
      return of(this.activeCompany);
    }

    return this.initCompany();
  }

  getByName(name: string): Company {
    return companies[name] || null;
  }
}
