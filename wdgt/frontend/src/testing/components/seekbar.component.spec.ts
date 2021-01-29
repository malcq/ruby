import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-seekbar',
  template: ''
})
export class MockSeekbarComponent {
  @Input() value = 0;
  @Input() currentTime = 0;
  @Input() duration = 0;
  @Output() valueChange = new EventEmitter();
}
