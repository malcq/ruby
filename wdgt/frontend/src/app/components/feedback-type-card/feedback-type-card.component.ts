import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  Feedback,
  FeedbackCategory
} from '../../_models';

@Component({
  selector: 'app-feedback-type-card',
  templateUrl: './feedback-type-card.component.html',
  styleUrls: [
    './feedback-type-card.component.scss',
    '../../fancy.css',
  ]
})
export class FeedbackTypeCardComponent implements OnInit {

  @Input() loading = false;

  @Input() feedback: Feedback = null;

  @Input() productImage: string = null;

  @Input() feedbackTypes: FeedbackCategory[] = [];

  @Input() vin: string = null;

  @Input() productTitle: string = null;

  @Output() categoryPress = new EventEmitter();

  carImage: string;

  constructor() { }

  ngOnInit() {
    console.log('FeedbackTypeCardComponent', this.feedback);
    if (this.feedback && this.feedback.productModel && this.feedback.productModel.image) {
      this.carImage = this.feedback.productModel.image;
    } else {
      this.carImage = '/assets/img/backgrounds/feedback-type.png';
    }
  }

  onCategoryPress(category) {
    this.categoryPress.emit(category);
  }
}
