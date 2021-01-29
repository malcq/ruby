import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-slider-content',
  template: ''
})
export class MockWelcomeSliderContentComponent {
  @Input() image = '/assets/img/welcome-slider/slide1.png';
}
