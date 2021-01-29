import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-fancy-marker',
  template: ''
})
export class MockFancyMarkerComponent {
  @Input() simple = true;
  @Input() title = '';
}
