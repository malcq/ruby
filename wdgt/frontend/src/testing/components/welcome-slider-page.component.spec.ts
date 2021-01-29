import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-slider-page',
  template: ''
})
export class MockWelcomeSliderPageComponent {
  @Input() firstPage = false;
  @Input() title = '';
  @Input() description = '';
  @Input() image: string = null;
}
