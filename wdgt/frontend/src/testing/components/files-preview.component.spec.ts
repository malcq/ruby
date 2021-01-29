import { Component, Input, Output, EventEmitter, } from '@angular/core';

import { BaseFile } from '../../app/_models';

@Component({
  selector: 'app-files-preview',
  template: ''
})
export class MockFilesPreviewComponent {
  @Input() files: BaseFile[];
  @Input() updateRequest = false;
  @Output() removeFile = new EventEmitter();
  @Output() addFile = new EventEmitter();
}
