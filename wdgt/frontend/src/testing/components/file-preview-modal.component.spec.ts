import { Component, Input, Output, EventEmitter, } from '@angular/core';

import { BaseFile } from '../../app/_models';

@Component({
  selector: 'app-file-preview-modal',
  template: ''
})
export class MockFilePreviewModalComponent {
  @Input() file: BaseFile;
  @Output() close = new EventEmitter();
}
