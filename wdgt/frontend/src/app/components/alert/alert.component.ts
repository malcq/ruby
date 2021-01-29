import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import {
  animate,
  transition,
  trigger,
  style,
} from '@angular/animations';

import { AlertService } from '../../_services';
import { ALERT_CONFIG } from '../../config/alert';

const alertAnimation = trigger('alertAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
    }),
    animate('0.3s', style({ opacity: 1 })),
  ]),

  transition(':leave', [
    animate('0.3s', style({ opacity: 0 })),
  ])
]);

@Component({
  moduleId: module.id,
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    alertAnimation,
  ]
})

export class AlertComponent implements OnInit {
  message: any;

  @Input() alertStyle: string = null;

  hideTimeout: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getMessage()
      .subscribe(message => {
        this.message = message;

        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
          this.hideTimeout = false;
        }

        this.hideTimeout = setTimeout(() => {
          this.message = null;
          this.hideTimeout = false;
        }, ALERT_CONFIG.TIME_BEFORE_HIDE);
    });
  }

  closeAlert() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = false;
    }
    this.message = null;
  }
}
