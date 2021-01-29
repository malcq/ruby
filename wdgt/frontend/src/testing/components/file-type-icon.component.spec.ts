import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-file-type-icon',
  template: ''
})
export class MockFileTypeIconComponent {
  @Input() type = '';
  @Output() click = new EventEmitter();
}
