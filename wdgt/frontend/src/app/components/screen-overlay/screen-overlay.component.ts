import {
  Component,
  OnInit,
} from '@angular/core';

import * as utils from '../../_core/utils';

import { CurrentFeedbackService } from '../../_services/current-feedback.service';

@Component({
  selector: 'app-screen-overlay',
  templateUrl: './screen-overlay.component.html',
  styleUrls: ['./screen-overlay.component.scss']
})
export class ScreenOverlayComponent implements OnInit {

  logo = null;

  constructor(
    private currentFeedbackService: CurrentFeedbackService,
  ) { }

  ngOnInit() {
    this.currentFeedbackService
      .get()
      .subscribe(feedback => {
        this.logo = utils.get(feedback, 'company.companyLogo', null);
      });
  }

}
