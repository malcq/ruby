import {
  Component,
} from '@angular/core';

import {
  DialogBaseComponent,
} from '../../dialog-base.component';


@Component({
  moduleId: module.id,
  selector: 'app-test',
  templateUrl: 'test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements DialogBaseComponent {

  options: any;
  context: any;

  constructor() { }

  close() {
   this.context.close('Done test!');
  }
}
