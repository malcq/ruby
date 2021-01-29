import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-where-vin',
  template: ''
})
export class MockWhereVinComponent {
  @Output() close = new EventEmitter<any>();
}
