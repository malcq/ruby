import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  FeedbackCategoryService,
  CurrentFeedbackService,
  WidgetService,
} from '../_services';

import { ROUTES } from '../config/router';

@Component({
  selector: 'app-contact-type-select',
  templateUrl: './contact-type-select.component.html',
  styleUrls: ['./contact-type-select.component.scss']
})
export class ContactTypeSelectComponent implements OnInit {
  canClose: boolean = true;
  categories = [];

  constructor(
    private feedbackCategoryService: FeedbackCategoryService,
    private currentFeedbackService: CurrentFeedbackService,
    private widgetService: WidgetService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.canClose = this.widgetService.isWidget();
    this.feedbackCategoryService.getAll()
      .subscribe(
        (response) => {
          this.categories = response;
        },
        (error) => console.error(error.message),
      );
  }

  onTypeClick(category) {
    this.currentFeedbackService.get()
      .subscribe(
        feedback => {
          feedback.feedbackCategory = category;
          this.currentFeedbackService.save().subscribe(() => {
            this.router.navigate([`/${ROUTES.recordType}`]);
          });
        }
      );

  }

  back() {
    this.widgetService.close();
  }
}
