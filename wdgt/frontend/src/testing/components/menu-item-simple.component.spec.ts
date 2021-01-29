import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-menu-item-simple',
  template: ''
})
export class MockMenuItemSimpleComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() description = '';
  @Input() disabled = false;
}
