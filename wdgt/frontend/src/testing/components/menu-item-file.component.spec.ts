import { Component, Input, Output, EventEmitter, } from '@angular/core';

import { UploadedFile } from '../../app/_models';

@Component({
  selector: 'app-menu-item-file',
  template: ''
})
export class MockMenuItemFileComponent {
  @Input() files: UploadedFile[];
  @Input() headerCaption: string;
  @Input() getStarted: boolean;
  @Input() isEditable: boolean;
}
