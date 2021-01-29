import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-fancy-button',
  template: ''
})
export class MockFancyButtonComponent {
  @Input() title = 'Button';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() rounded = false;
  @Input() type = 'button';
  @Input() viewType = 'primary';
  @Output() buttonPress = new EventEmitter<any>();
}
