import { Component, Input, Output, EventEmitter, } from '@angular/core';

import { Feedback, FeedbackCategory } from '../../app/_models';

@Component({
  selector: 'app-feedback-type-card',
  template: ''
})
export class MockFeedbackTypeCardComponent {
  @Input() loading = false;
  @Input() feedback: Feedback = null;
  @Input() productImage: string = null;
  @Input() feedbackTypes: FeedbackCategory[] = [];
  @Input() vin: string = null;
  @Input() productTitle: string = null;
  @Output() categoryPress = new EventEmitter();
}
