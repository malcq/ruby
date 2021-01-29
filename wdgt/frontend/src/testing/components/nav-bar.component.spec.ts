import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  template: ''
})
export class MockNavBarComponent {
  @Input() blue = false;
  @Input() xButton = false;
  @Input() hideBack = false;
  @Input() title: string = null;
  @Input() rightButtonTitle: string = null;
  @Output() leftButtonPress = new EventEmitter();
  @Output() rightButtonPress = new EventEmitter();
}
