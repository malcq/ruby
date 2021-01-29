import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  template: ''
})
export class MockMenuItemComponent {
  @Input() showArrow = true;
  @Input() headerCaption = '';
}
