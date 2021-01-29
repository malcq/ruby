import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-menu-item-product',
  template: ''
})
export class MockMenuItemProductComponent {
  @Input() carName = '';
  @Input() vin = '';
  @Input() feedbackType = '';
}
