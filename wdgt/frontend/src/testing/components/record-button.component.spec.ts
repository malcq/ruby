import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-record-button',
  template: ''
})
export class MockRecordButtonComponent {
  @Input() recording = false;
  @Output() startCapture = new EventEmitter();
  @Output() stopCapture = new EventEmitter();
}
