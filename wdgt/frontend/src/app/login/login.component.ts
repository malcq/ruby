import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feedback } from '../_models/feedback';
import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import {
  AlertService,
  CurrentFeedbackService,
  AuthenticationService,
  GeolocationService,
  CompanyService,
  WidgetService,
} from '../_services';

import { ROUTES } from '../config/router';

import { Company } from '../_models';

@Component({
  selector: 'app-contacts',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private alertService: AlertService,
    private currentFeedbackService: CurrentFeedbackService,
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
    private geolocationService: GeolocationService,
    private widgetService: WidgetService,
  ) { }

  ngOnInit() {
    let company: Company = null;
    let widgetConfig = null;
    let country = null;
    let sessionId = null;
    let productModel = null;
    this.widgetService.getConfig().pipe(
      switchMap((config) => {
        widgetConfig = config;
        return forkJoin(
          this.geolocationService.getCountry(),
          this.companyService.getAsync(),
          this.currentFeedbackService.remove(),
        );
      }))
    .pipe(
      switchMap(
        ([ countryResponse, companyResponse ]) => {
          country = countryResponse;
          company = companyResponse;
          return this.authenticationService.signInByHash(widgetConfig.hashcode, country)
        }
      ),
      switchMap(
        (authResponse: any) => {
          sessionId = authResponse.sessionId;
          productModel = authResponse.productModel;
          return this.currentFeedbackService.setProductModel(productModel, null, null, sessionId, country);
        }
      ),
      switchMap(
        (feedback: Feedback) => {
          feedback.companyId = company.id;
          feedback.feedbackCategory = {
            id: 2,
            company,
            title: 'Issue',
            type: 'issue'
          };
          feedback.feedbackCategory = this.getFeedbackCategory();
          return this.currentFeedbackService.save();
        }
      )
    )
    .subscribe(
      () => {
        this.router.navigate([`/${ROUTES.chat}`]);
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  /**
   * Returns constant value
   * Parametrize or make api call if needed
  */
  getFeedbackCategory() {
    return {
      id: 4,
      title: 'Product',
      type: 'product',
      company: {
        'id': 1,
        'name': 'BMW',
        'productId': null,
        'logo': null,
        'backgroundMain': '/assets/img/backgrounds/login.png',
        'avatarImage': '/assets/img/chat-avatar-bmw.png',
        'theme': 'BMW',
        'texts': {
          'library': {
            'title': 'Record.',
            'description': 'Select your channel...'
          }
        }
      }
    };
  }
}
