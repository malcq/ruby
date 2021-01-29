import { Component, OnInit } from '@angular/core';

import { switchMap } from 'rxjs/operators';

import {
  AlertService,
  UserService,
  CurrentFeedbackService,
} from '../_services';

@Component({
  selector: 'app-final-message',
  templateUrl: './final-message.component.html',
  styleUrls: ['./final-message.component.css', '../fancy.css']
})
export class FinalMessageComponent implements OnInit {
  public username: string = null;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private currentFeedbackService: CurrentFeedbackService,
  ) { }

  ngOnInit() {
    this.userService.getCurrent()
      .pipe(
        switchMap(
          (user) => {
            this.username = user.name;
            return this.currentFeedbackService.remove();
          }
        )
      )
      .subscribe(
        () => {},
        error => {
          this.alertService.error(error);
        }
      );
  }
}
