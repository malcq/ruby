import {
  Component,
  OnInit,
  Input,
  EventEmitter,
} from '@angular/core';

import { ChatInputBaseComponent } from '../../chat-view/chat-input-base.component';
import { messageComponentResolver } from '../../../../_models/message/message-component-resolver';

import {
  AlertService,
  UserService,
} from '../../../../_services';

import { validationPatters } from '../../../../config/forms';

@Component({
  selector: 'app-chat-input-login',
  templateUrl: './chat-input-login.component.html',
  styleUrls: [
    './chat-input-login.component.css',
    '../../../../fancy.css',
  ]
})
export class ChatInputLoginComponent implements OnInit, ChatInputBaseComponent {

  @Input() data: any;
  @Input() context: any;

  public name = '';
  public email = '';
  public loading = false;

  public emailPattern = validationPatters.email;

  constructor(
    private alertService: AlertService,
    private userService: UserService,
  ) { }

  ngOnInit() {
  }

  onSubmitPress() {
    this.loading = true;
    const trimmedName = this.name.trim();
    const trimmedEmail = this.email.trim();

    const result = {
      name: trimmedName,
      email: trimmedEmail.toLowerCase(),
    };
    this.userService.updateInfoForCurrent(result.name, result.email)
      .subscribe(
        (data) => {
          this.context.sendConfirmEmail(`${result.name}, ${result.email}`);
        },
        (error) => {
          this.loading = false;
          this.alertService.error(error);
        }
      );
  }


  validateEmail(str: string) {
    // tslint:disable-next-line:max-line-length
    const mailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return mailRegEx.test(str);
  }
}


messageComponentResolver.addComponent('app-chat-input-login', ChatInputLoginComponent);
