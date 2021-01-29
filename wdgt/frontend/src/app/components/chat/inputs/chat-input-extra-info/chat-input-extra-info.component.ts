import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import { Observable ,  of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ChatInputBaseComponent } from '../../chat-view/chat-input-base.component';
import { messageComponentResolver } from '../../../../_models/message/message-component-resolver';

import { validationPatters } from '../../../../config/forms';

import {
  AuthenticationService,
  CurrentFeedbackService,
  AlertService,
} from '../../../../_services';

@Component({
  selector: 'app-chat-input-extra-info',
  templateUrl: './chat-input-extra-info.component.html',
  styleUrls: [
    './chat-input-extra-info.component.css',
    '../../../../fancy.css',
  ]
})
export class ChatInputExtraInfoComponent implements OnInit, ChatInputBaseComponent {

  @Input() data: any = {};
  @Input() context: any;


  public icon;
  public loading = false;
  public placeholder;
  public submitTitle;
  public validationPattern = validationPatters.default;

  public inputValue = '';

  constructor(
    private authenticationService: AuthenticationService,
    private currentFeedbackService: CurrentFeedbackService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    const {
      icon,
      placeholder = '',
      submitTitle = 'Proceed',
    } = this.data;

    this.icon = icon;
    this.placeholder = placeholder;
    this.submitTitle = submitTitle;
    this.validationPattern = this.getRightInputPattern();
  }

  onSubmitPress() {
    this.loading = true;
    this.currentFeedbackService.get()
    .pipe(
      mergeMap(
        feedback => this.updateExtraInfo((feedback as any).sessionId)
      )
    )
    .subscribe(
      (data) => {
        this.context.sendText(this.inputValue);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.alertService.error(error);
      }
    );
  }

  getRightInputPattern() {
    switch (this.icon) {
      case 'mail':
        return validationPatters.email;
      case 'account_circle':
      default:
        return validationPatters.default;
    }
  }

  updateExtraInfo(sessionId): Observable<void> {
    const extraInfo = this.inputValue;
    console.debug(`updateExtraInfo ${this.icon} ${extraInfo} ${sessionId}`);
    switch (this.icon) {
      case 'mail':
        return this.updateEmail(extraInfo, sessionId);
      case 'account_circle':
        return this.updateName(extraInfo, sessionId);
      default:
        return of();
    }
  }

  updateName(name: string, sessionId: string): Observable<void> {
    return this.authenticationService.updateName(name, sessionId);
  }

  updateEmail(email: string, sessionId: string): Observable<void> {
    return this.authenticationService.updateEmail(email, sessionId);
  }
}


messageComponentResolver.addComponent(
  'app-chat-input-extra-info',
  ChatInputExtraInfoComponent,
);
