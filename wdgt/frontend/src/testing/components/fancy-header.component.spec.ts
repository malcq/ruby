import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fancy-header',
  template: ''
})
export class MockFancyHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() blacked = true;
  @Input() blueTitle = false;
  @Input() descriptionSize = 15;
  @Input() centerTitle = false;
  @Input() raiseTitle = false;
  @Input() smallDescription = false;
}
