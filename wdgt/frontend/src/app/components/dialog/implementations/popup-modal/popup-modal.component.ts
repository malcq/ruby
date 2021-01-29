import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import {
  animate,
  trigger,
  style,
  animation,
  transition,
} from '@angular/animations';

import { DialogBaseComponent } from '../../dialog-base.component';

const popupAnimation = trigger('popup', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(5%) scale(1.1)',
    }),
    animate('0.3s ease-in', style({
      opacity: 1,
      transform: 'translateX(0) scale(1)',
    })),
  ]),
  transition('* => void', [
    animate('4s ease-in', style({
      opacity: 0,
    })),
  ]),
]);

interface Button {
  title: string;
  danger?: boolean;
}

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss'],
  animations: [
    popupAnimation,
  ],
})
export class PopupModalComponent implements OnInit, DialogBaseComponent {

  options: any = {};
  context;

  /**
   * Popup titles
   */
  title: string;

  /**
   * Popup description
   */
  description: string;

  /**
   * List of buttons which will be shown
   * Note: current implementation support 1 or 2 buttons only!
   */
  buttons: Button[];

  constructor() { }

  ngOnInit() {
    const {
      title = null,
      description = null,
      buttons = [],
    } = this.options;

    this.title = title;
    this.description = description;
    this.buttons = buttons;
  }

  onButtonClick(button: Button) {
    this.close(button);
  }

  close(button: Button) {
    this.context.close(button.title);
  }

}
